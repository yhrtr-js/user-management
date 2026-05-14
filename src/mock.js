const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 1, created: '2024-01-10' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', status: 1, created: '2024-02-15' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '访客', status: 0, created: '2024-03-20' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑', status: 1, created: '2024-04-05' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', role: '访客', status: 1, created: '2024-05-01' },
  { id: 6, name: '周八', email: 'zhouba@example.com', role: '管理员', status: 0, created: '2024-05-18' },
  { id: 7, name: '吴九', email: 'wujiu@example.com', role: '访客', status: 1, created: '2024-06-02' },
]

let nextId = 8

// 模拟获取列表接口
export const fetchUserList = ({ name, status, page, pageSize }) => {
  let result = [...users]
  if (name) result = result.filter(u => u.name.includes(name))
  if (status !== '') result = result.filter(u => u.status === Number(status))
  const total = result.length
  const data = result.slice((page - 1) * pageSize, page * pageSize)
  return Promise.resolve({ data, total })
}

// 模拟新增接口
export const addUser = (form) => {
  const today = new Date().toISOString().slice(0, 10)
  users.unshift({ id: nextId++, ...form, created: today })
  return Promise.resolve({ success: true })
}

// 模拟编辑接口
export const updateUser = (form) => {
  const index = users.findIndex(u => u.id === form.id)
  if (index !== -1) Object.assign(users[index], form)
  return Promise.resolve({ success: true })
}

// 模拟删除接口
export const deleteUser = (id) => {
  const index = users.findIndex(u => u.id === id)
  if (index !== -1) users.splice(index, 1)
  return Promise.resolve({ success: true })
}

// 模拟状态切换接口
export const toggleStatus = (id, status) => {
  const user = users.find(u => u.id === id)
  if (user) user.status = status
  return Promise.resolve({ success: true })
}



const orders = [
  { id: 'ORD-001', buyer: '张三', product: 'iPhone 15', amount: 5999, date: '2024-08-01', status: 'wait_pay' },
  { id: 'ORD-002', buyer: '李四', product: '小米手环8', amount: 229, date: '2024-08-02', status: 'wait_ship' },
  { id: 'ORD-003', buyer: '王五', product: '索尼耳机', amount: 1299, date: '2024-08-03', status: 'shipped' },
  { id: 'ORD-004', buyer: '赵六', product: '机械键盘', amount: 599, date: '2024-08-04', status: 'done' },
  { id: 'ORD-005', buyer: '孙七', product: '显示器4K', amount: 2399, date: '2024-08-05', status: 'cancelled' },
]

export const fetchOrderList = ({ keyword, status, page, pageSize }) => {
  let result = [...orders]
  if (keyword) result = result.filter(o => o.buyer.includes(keyword) || o.id.includes(keyword))
  if (status) result = result.filter(o => o.status === status)
  const total = result.length
  const data = result.slice((page - 1) * pageSize, page * pageSize)
  return Promise.resolve({ data, total })
}

export const shipOrder = (id) => {
  const order = orders.find(o => o.id === id)
  if (order) order.status = 'shipped'
  return Promise.resolve({ success: true })
}

export const receiveOrder = (id) => {
  const order = orders.find(o => o.id === id)
  if (order) order.status = 'done'
  return Promise.resolve({ success: true })
}

export const cancelOrder = (id) => {
  const order = orders.find(o => o.id === id)
  if (order) order.status = 'cancelled'
  return Promise.resolve({ success: true })
}

export const fetchOrderDetail = (id) => {
  const order = orders.find(o => o.id === id)
  return Promise.resolve(order)
}

