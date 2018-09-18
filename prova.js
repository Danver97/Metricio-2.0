const EM = require('events');

const em = new EM();

em.on('ev', (obj) => {
  obj.sum = 0;
  for (let i = 0; i < 1000000; i++){
    obj.sum += i;
  }
  console.log('done. ' + obj.sum);
});

em.on('ev2', (obj) => {
  obj.sum = 0;
  for (let i = 0; i < 1000000; i++){
    obj.sum += i;
  }
  obj.sum = 134;
  obj.diff = { a: 24 };
  console.log('done2. ' + obj.sum);
});
const obj = { sum: 0 };
em.emit('ev', obj);
em.emit('ev2', obj);
console.log('Will it finish? ' + JSON.stringify(obj));
