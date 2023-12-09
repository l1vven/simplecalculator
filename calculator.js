let keys = document.querySelectorAll('.keybutton')
let screen = document.querySelector('.screen > p')
let last_oper_was_equal = false
let last_result = 0
keys.forEach(function(elem) {
  elem.addEventListener('click', function(e) {
    if (last_oper_was_equal) {
      screen.innerText = last_result
      last_oper_was_equal = false
    }
    type_a_value(e)
  })
})

function type_a_value(event) {
  let operators = ['×', '÷', '-', '+', '(', ')']
  let pressed_key = event.target.innerText
  let text_to_add = ''
  if (pressed_key === '=') {
    let result = make_a_calc(screen.innerText)
    screen.innerText += ' = ' + result
    last_oper_was_equal = true
    last_result = result
    return
  }
  if (pressed_key === 'C') {
    screen.innerText = '0'
    return
  }
  if (pressed_key === '←') {
    if (screen.innerText.length === 1) {
      screen.innerText = '0'
    } else {
      screen.innerText = screen.innerText.substring(0, screen.innerHTML.length-1)
    }
    return
  }
  if (['×', '÷', '-', '+', 'xy'].includes(pressed_key)) {
    let temp_array = screen.innerText.split(' ')

  }
  if (operators.includes(pressed_key)) {
    text_to_add = ' ' + pressed_key + ' '
  } else if (pressed_key === 'xy') {
    text_to_add = ' ** '
  } else {
    text_to_add = pressed_key
  }
  if (['×', '÷', '-', '+', 'xy'].includes(pressed_key)) {
    let temp_array = screen.innerText.split(' ')
    if (['×', '÷', '-', '+', '**'].includes(temp_array.at(-1))) {
      temp_array[temp_array.length-1] = text_to_add.trim()
      screen.innerHTML = temp_array.join(' ') + ' '
    } else {
      screen.innerHTML += text_to_add
    }
  } else if (pressed_key === '.') {
    let temp_array = screen.innerText.split(' ')
    if (temp_array.at(-1).includes('.')) return
    if (isNaN(temp_array.at(-1))) return
    screen.innerHTML += text_to_add
  } else if (screen.innerText === '0') {
    screen.innerHTML = text_to_add
  } else if (pressed_key === '(') {
    let temp_array = screen.innerText.split(' ')
    temp_array = temp_array.filter(elem => !['', ' ', '(', ')'].includes(elem))
    if (isNaN(parseFloat(temp_array.at(-1)))) {
      screen.innerHTML += text_to_add
    }
  } else if (pressed_key === ')') {
    let temp_array = screen.innerText.split(' ')
    temp_array = temp_array.filter(elem => !['', ' ', '(', ')'].includes(elem))
    if (!isNaN(parseFloat(temp_array.at(-1)))) {
      screen.innerHTML += text_to_add
    }
  } else {
    screen.innerHTML += text_to_add
  }
}

// Функции вычислений для конкретных математических операторов

let sum = function(operand1, operand2) {
  return operand1 + operand2
}

let minus = function(operand1, operand2) {
  return operand1 - operand2
}

let multiplication = function(operand1, operand2) {
  return operand1 * operand2
}

let division = function(operand1, operand2) {
  return operand1 / operand2
}

let power = function(operand1, operand2) {
  return operand1 ** operand2
}

// Словарь с этими функциями конкретных операторов

let operations = {
  "**": power,
  "÷": division,
  "×": multiplication,
  "-": minus,
  "+": sum,
}

// Функция, которая избавляется от скобок в математическом примере (находит скобки, и на место подпримера между скобками и самих скобок ставит результат его вычисления). На вход принимает строку с примером, в которой все операторы и операнды разделены пробелами
function make_a_calc(math_string) {
  // Преобразуем строку с примером в массив и пытаемся найти скобки
  let math_elems = math_string.split(' ')
  // Отфильтровываем пустые элементы (появляются если пользователь ввёл лишние пробелы)
  math_elems = math_elems.filter(elem => elem !== '')
  // С перва ищем 1ю попавшуюся закрывающую скобку
  let close_round_bracket_index = math_elems.indexOf(')')
  // Затем начиная с этой закрывающей скобки двигаясь в обратном порядке ищем ближайшую открывающую скобку
  let open_round_bracket_index = math_elems.lastIndexOf('(', close_round_bracket_index)
  // Если есть закрывающая скобка заходим в цикл 
  while (close_round_bracket_index !== -1) {
    // Если перед закрывающей скобкой нету открывающей, то удаляем эту отдельную закрывающую скобку, пытаемся найти скобки опять и переходим к следующей итерации
    if (open_round_bracket_index === -1) {
      math_elems.splice(close_round_bracket_index, 1)
      close_round_bracket_index = math_elems.indexOf(')')
      open_round_bracket_index = math_elems.lastIndexOf('(', close_round_bracket_index)
      continue
    }
    // Если скобки есть, то элементы между ними выносим в отдельный массив и вычисляем
    let sub_math_elems = math_elems.slice(open_round_bracket_index+1, close_round_bracket_index)
    let sub_result = simple_calc(sub_math_elems)
    // Заменяем нашим результатом элементы в массиве включая скобки
    let elems_to_splice = close_round_bracket_index - open_round_bracket_index + 1
    math_elems.splice(open_round_bracket_index, elems_to_splice, sub_result)
    // По новой ищем скобки для следующей итерации цикла
    close_round_bracket_index = math_elems.indexOf(')')
    open_round_bracket_index = math_elems.lastIndexOf('(', close_round_bracket_index)
  }
  // Проверяем оставшийся массив на наличие отдельных открывающих скобок и удаляем их, если есть
  open_round_bracket_index = math_elems.indexOf('(')
  while (open_round_bracket_index !== -1) {
    math_elems.splice(open_round_bracket_index, 1)
    open_round_bracket_index = math_elems.indexOf('(')
  }
  // Вычисляем оставшийся массив и возвращаем результат
  let result = simple_calc(math_elems)
  return result
}

// Функция вычисляющая математический пример (без скобок) полученный в виде массива операторов и операндов
function simple_calc(math_elems) {
  // Для каждого математического оператора в словаре операторов находим его в массиве примера и вычисляем значение
  for (let oper in operations) {
    // Если длина массива с примером равна 1, то значит мы всё посчитали и можно выходить из цикла
    if (math_elems.length === 1) {
      break
    }
    // Определяем откуда считать нужно: если оператор - возведение в степень, то справа налево, иначе слева направо
    let operator_index = oper === "**" ? math_elems.lastIndexOf(oper) : math_elems.indexOf(oper)
    // Ну и теперь пока в массиве имеется этот оператор вычисляем
    while (operator_index !== -1) {
      let operand1 = parseFloat(math_elems[operator_index-1])
      let operand2 = parseFloat(math_elems[operator_index+1])
      let result = operations[oper](operand1, operand2).toString()
      // После вычисления заменяем полученным результатом вычисленные элементы
      math_elems.splice(operator_index-1, 3, result)
      // Ищем следующий оператор в массиве с примером
      operator_index = oper === "**" ? math_elems.lastIndexOf(oper) : math_elems.indexOf(oper)
    }
  }
  // В конце останется массив с одним единственным элементом, который мы и возвращаем в качестве ответа
  return math_elems[0] // Тип этого элемента - строка
}
