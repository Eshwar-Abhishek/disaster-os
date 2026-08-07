/**
 * Emergency SOS Mesh Network Relay Simulator
 * Relays offline SOS signals across local browser windows / devices via BroadcastChannel
 */

export class SOSMeshNetwork {
  constructor() {
    this.channelName = 'RESQ_EMERGENCY_MESH_NET';
    this.bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(this.channelName) : null;
    this.listeners = [];

    if (this.bc) {
      this.bc.onmessage = (event) => {
        const msg = event.data;
        this.notifyListeners(msg);
      };
    }
  }

  broadcastSOS(sosPayload) {
    const packet = {
      id: 'MESH-' + Date.now(),
      sender: sosPayload.name || 'Victim',
      gps: sosPayload.gps || 'Unknown Coordinates',
      status: sosPayload.status || 'Critical SOS',
      message: sosPayload.message || 'Help needed',
      hops: (sosPayload.hops || 0) + 1,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage mesh buffer
    const existing = JSON.parse(localStorage.getItem('resq_mesh_packets') || '[]');
    existing.unshift(packet);
    localStorage.setItem('resq_mesh_packets', JSON.stringify(existing.slice(0, 50)));

    if (this.bc) {
      this.bc.postMessage(packet);
    }

    return packet;
  }

  getBufferedPackets() {
    return JSON.parse(localStorage.getItem('resq_mesh_packets') || '[]');
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(packet) {
    this.listeners.forEach(cb => cb(packet));
  }
}

export const sosMesh = new SOSMeshNetwork();
