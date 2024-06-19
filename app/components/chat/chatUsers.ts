const userData = [
  {
    id: 'support-agent',
    data: {
      name: 'John (Support Agent)',
      custom: { initials: 'SA', avatar: '#9fa7df' }
    }
  },
  {
    id: 'supported-user',
    data: { name: 'Mary Watson', custom: { initials: 'MW', avatar: '#ffab91' } }
  }
];
const randomizedUsers = Math.random() < 0.5 ? userData : userData.reverse();

export default randomizedUsers;
