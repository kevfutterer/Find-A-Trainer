import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Kevin',
          lastName: 'Futterer',
          areas: ['frontend', 'backend'],
          description:
            'I am Kevin and as a Junior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30,
        },
        {
          id: 'c2',
          firstName: 'Max',
          lastName: 'Musterman',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Max and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations,
  actions,
  getters,
};
