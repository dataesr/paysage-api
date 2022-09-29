import agenda from '../jobs/data';

agenda.every('10 seconds', 'backup data');
