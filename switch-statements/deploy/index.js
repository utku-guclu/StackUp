document.getElementById('calculate').addEventListener('click', () => {
  let list = document.getElementById('main-input').value;
  list = list.replaceAll(' ', '').trim().replace(/,+$/, '');
  
  list = list.split(',')
  list = list.map((item, index) => {
    return parseInt(item);
  })

  const operator = document.getElementById('operator').value;
  const output = document.getElementById('output');

  let sum = 0;
  let max = -Infinity;
  let min = Infinity;

  switch(operator) {
    case 'sum':
      for (let num of list) {
        sum += parseInt(num)
      }
      output.innerHTML = sum;
      break;
    case 'average':
      for (let num of list) {
        sum += parseInt(num)
      }
      output.innerHTML = sum / list.length;
      break;
    case 'min':
      for (let num of list) {
        if (num < min) {
          min = num
        }
      }
      output.innerHTML = min;
      break;
    case 'max':
      for (let num of list) {
        if (num > max) {
          max = num
        }
      }
      output.innerHTML = max;
      break;
    case 'median':
      // sort list
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[i] < list[j]) {
            let temp = list[i];
            list[i] = list[j];
            list[j] = temp;
          }
        }
      }
      // get median
      let median = 0;
      if (list.length % 2 === 0) {
        median = (list[list.length / 2] + list[(list.length / 2) - 1]) / 2
      } else {
        median = list[Math.floor(list.length / 2)]
      }
      output.innerHTML = median;
      break;
    case 'mode':
      let frequency = {}
      for (num of list) {
        if (!(num in frequency)) {
          frequency[num] = 0
        }
        frequency[num] += 1
      }
      const values = Object.values(frequency);
      const maxValue = Math.max(...values);
      
      const mode = maxValue === 1 ? NaN : Object.keys(frequency).filter(key => frequency[key] === maxValue);

      output.innerHTML = mode;
      break;
    case 'range':
      for (num of list) {
        if (num < min) {
          min = num;
        }
        if (num > max) {
          max = num;
        }
      }
    output.innerHTML = max - min;
    break;

    default:
      output.innerHTML = 'Invalid operator';
      break
  }
})

