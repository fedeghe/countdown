const testone = require('@fedeghe/testone');

const checkop = (op, b) => {
  var rx = /^([*/+-]{1})?((\d{1,})(\.\d*)?)$/,
      m = op.match(rx),
      whole = '', oper;
  if (m) {
    whole = m[0];
    oper = m[1];
  }
  if (!oper) whole = '+' + whole;
  return m ? eval((b || 0) + '' + whole) : false
}
           
testone([
  	{ in: ['1', 2], out: 3 },
  	{ in: ['+1232'], out: 1232 },
  	{ in: ['+1232', 1], out: 1233 },
  	{ in: ['5000', 10001], out: 15001 },
  	{ in: ['+5000', 10001], out: 15001 },
    { in: ['-5000', 10001], out: 5001 },
    { in: ['-1232'], out: -1232 },
    { in: ['-1232', 1], out: -1231 },
    { in: ['*1232', 1], out: 1232 },
    { in: ['/1232'], out: 0 },
    { in: ['/1232', 1], out: 1/1232 },
    { in: ['/1232.2'], out: 0  },
    { in: ['/1232.2', 2], out: 2/1232.2 },
    { in: ['-1232.23'], out: -1232.23 },
    { in: ['+1232.23'], out: 1232.23 },
    { in: ['*1232.23'], out: 0 },
    { in: ['*aaaaa'], out: false },
    { in: ['*aaaaa3244234'], out: false },
    { in: ['=3244234'], out: false },
  ],
  checkop,
  {iterations: 1}
).then(r => console.log(JSON.stringify(r, null, 2)))

console.log(('0+33'))