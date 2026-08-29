import { Collaborator, CollabMessage, CollabRole } from './types';
import { getSupabaseClient } from '../supabase/client';
import { useAuthStore } from '../auth/auth-store';

const COLLAB_COLORS = [
  '#38BDF8', // Sky Blue
  '#F43F5E', // Rose
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export function generateCollabUser(role: CollabRole = 'editor', isHost: boolean = false): Collaborator {
  const authUser = useAuthStore.getState().user;
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('robocraft_user_name') : null;
  
  const id = authUser?.id || `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const userName = 
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email?.split('@')[0] || 
    storedName || 
    `Partner ${Math.floor(100 + Math.random() * 900)}`;
  const avatar = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture;
  const color = COLLAB_COLORS[Math.floor(Math.random() * COLLAB_COLORS.length)];

  return {
    id,
    name: userName,
    avatar,
    color,
    role,
    isHost,
    joinedAt: Date.now(),
    lastActive: Date.now(),
  };
}

export type CollabMessageHandler = (message: CollabMessage) => void;

class CollabSyncService {
  private activeRoomId: string | null = null;
  private currentUser: Collaborator | null = null;
  private messageHandlers: Set<CollabMessageHandler> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private supabaseChannel: any = null;
  private heartbeatInterval: any = null;

  public initRoom(roomId: string, user: Collaborator) {
    this.leaveRoom();

    this.activeRoomId = roomId;
    this.currentUser = user;

    // 1. Initialize Browser BroadcastChannel (Instant multi-tab sync)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(`robo_collab_${roomId}`);
        this.broadcastChannel.onmessage = (event) => {
          const msg = event.data as CollabMessage;
          if (msg && msg.senderId !== this.currentUser?.id) {
            this.notifyHandlers(msg);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }

    // 2. Initialize Supabase Realtime Channel
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        this.supabaseChannel = supabase.channel(`robo_collab_${roomId}`, {
          config: {
            broadcast: { self: false },
          },
        });

        this.supabaseChannel
          .on('broadcast', { event: 'collab_event' }, (payload: any) => {
            const msg = payload.payload as CollabMessage;
            if (msg && msg.senderId !== this.currentUser?.id) {
              this.notifyHandlers(msg);
            }
          })
          .subscribe((status: string) => {
            if (status === 'SUBSCRIBED') {
              this.broadcast({
                type: 'presence_join',
                senderId: user.id,
                senderName: user.name,
                senderColor: user.color,
                roomId,
                payload: { user },
                timestamp: Date.now(),
              });
            }
          });
      } catch (err) {
        console.warn('Supabase Realtime subscription error:', err);
      }
    }

    // Announce presence via local broadcast channel
    this.broadcast({
      type: 'presence_join',
      senderId: user.id,
      senderName: user.name,
      senderColor: user.color,
      roomId,
      payload: { user },
      timestamp: Date.now(),
    });

    // Send heartbeat every 15s to keep active status
    this.heartbeatInterval = setInterval(() => {
      if (this.currentUser && this.activeRoomId) {
        this.broadcast({
          type: 'presence_heartbeat',
          senderId: this.currentUser.id,
          senderName: this.currentUser.name,
          senderColor: this.currentUser.color,
          roomId: this.activeRoomId,
          payload: { user: this.currentUser },
          timestamp: Date.now(),
        });
      }
    }, 15000);
  }

  public onMessage(handler: CollabMessageHandler) {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  private notifyHandlers(message: CollabMessage) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (err) {
        console.error('Error handling collab message:', err);
      }
    });
  }

  public broadcast(message: CollabMessage) {
    if (!this.activeRoomId) return;

    // Send to local broadcast channel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (err) {
        console.warn('Broadcast error:', err);
      }
    }

    // Send to Supabase channel if active
    if (this.supabaseChannel) {
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'collab_event',
          payload: message,
        });
      } catch (err) {
        console.warn('Supabase broadcast error:', err);
      }
    }
  }

  public leaveRoom() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.currentUser && this.activeRoomId) {
      this.broadcast({
        type: 'presence_leave',
        senderId: this.currentUser.id,
        senderName: this.currentUser.name,
        senderColor: this.currentUser.color,
        roomId: this.activeRoomId,
        timestamp: Date.now(),
      });
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    if (this.supabaseChannel) {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.removeChannel(this.supabaseChannel);
      }
      this.supabaseChannel = null;
    }

    this.activeRoomId = null;
    this.currentUser = null;
  }

  public setCurrentUser(user: Collaborator) {
    this.currentUser = user;
  }

  public getRoomId() {
    return this.activeRoomId;
  }

  public getCurrentUser() {
    return this.currentUser;
  }
}

export const collabSyncService = new CollabSyncService();
