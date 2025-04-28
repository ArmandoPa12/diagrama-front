import { onMounted, onUnmounted } from 'vue';
import socket from '@/utils/socket';

export const useWebSocket = (roomCode, onProjectLoaded) => {
    onMounted(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('join-room', roomCode);

        socket.on('project-data', (project) => {
            onProjectLoaded(project);
        });
    });

    onUnmounted(() => {
        socket.emit('leave-room', roomCode);
        socket.off('project-data');
    });

    const sendProjectData = (project) => {
        socket.emit('update-project', { roomCode, project });
    };

    return {
        sendProjectData
    };
};