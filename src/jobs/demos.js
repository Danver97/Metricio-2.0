/* eslint-disable no-mixed-operators */

/*
export const interval = '* * * * *';
export const perform = async (jobs) => {
  let result = [];
  jobs.forEach(async j => {
    const res = await j.perform();
    result = result.concat(res);
  });
  return result;
};
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function demoUsers() {
  return Array.from({ length: 50 }, () => getRandomInt(1000, 1500));
}

export const interval = '* * * * *';
export const perform = async () => [{
  target: 'DemoUsers',
  data: {
    value: demoUsers(),
  },
},
{
  target: 'DemoMaster',
  data: {
    value: 'success',
  },
},
{
  target: 'DemoDevelop',
  data: {
    value: 'success',
  },
},
{
  target: 'DemoConversion',
  data: {
    value: getRandomInt(0, 10) / 100 + 1.3,
  },
},
{
  target: 'DemoProgress',
  data: {
    value: getRandomInt(1, 100),
  },
},
{
  target: 'DemoHistogram',
  data: {
    value: {
      categories: ['Apples', 'Blackberries', 'Bananas'],
      series: [
        {
          name: 'John',
          data: [2, 3, 4],
        },
        {
          name: 'Carl',
          data: [5, 7, 2],
        },
        {
          name: 'Susan',
          data: [3, 4, 1],
        },
      ],
    },
  },
},
];
