async function start() {
  await Promise.resolve('async is working');
}

start().then(console.log);

class Util {
  static id = Date.now();
}

console.log('Util id: ', Util.id);

const unused = 42;
console.log(unused);


import('Lodash').then(_ => {
  console.log('Lodash', _.random(0, 42, true));
});
