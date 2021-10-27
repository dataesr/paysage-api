import EventEmitter from 'events';

const emitter = new EventEmitter();
emitter.addListener('userCreated', () => console.log('nouvel evenement'));

emitter.addListener('logger', () => console.log('logger'));

export default emitter;
