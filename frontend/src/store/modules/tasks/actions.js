import axios from 'axios'

const url = 'http://localhost'

export default {
    async addTask(context, data) {

        const taskData = {
            taskName: data.taskName,
            time: data.time,
            category: data.category,
            completed: data.completed
        };

        try {
            const response = await axios.post(
                `${url}/api/add`,
                taskData);

            context.commit('addTask', {
                ...taskData,
                id: response.data.id
            });

        } catch (error) {
            throw new Error(error.message || 'Failed to add!');
        }

    },

    async loadTasks(context, payload) {

        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }

        try {
            const response = await axios.get(`${url}/api/all`);

            const tasks = [];

            for (const key in response.data) {
                const task = {
                    id: response.data[key].id,
                    taskName: response.data[key].taskName,
                    category: response.data[key].category,
                    time: response.data[key].time,
                    completed: response.data[key].completed,
                };
                tasks.push(task);
            }

            context.commit('setTasks', tasks);
            context.commit('setFetchTimestamp');

        } catch (error) {
            throw new Error(error.message || 'Failed to fetch!');
        }

    },

    async markTask(context, data) {
        try {

            data.completed = !data.completed

            await axios.put(
                `${url}/api/update/${data.id}`,
                data);

            context.commit('setMarked', data.id);

        } catch (error) {
            throw new Error(error.message || 'Failed to update!');
        }


    },

    async deleteSelectedTasks(context) {
        try {
            const getSelectedTasks = context.getters.getSelectedTasks;

            const deleteIds = getSelectedTasks.map(id => {
                const urls = `${url}/api/delete/${id}`;
                return axios.delete(urls);
            });

            await Promise.all(deleteIds);
            context.commit('clearSelectedTasks');

        } catch (error) {
            throw new Error(error.message || 'Error deleting tasks!');
        }

    },

    selectTask(context, data) {
        context.commit('selectTask', data);
    },

    removeTask(context, data) {
        context.commit('removeTask', data);
    }

};