import React from 'react'
import VirtualizedList from './component/VirtualizedList'

const bigData = Array.from({length : 50000}, (_,index)=> ({
  id : `item - ${index}`,
  text : 'sample item data payload'
}))

const Home = () => {

  return (
    <div className='p-5 w-125'>
      <h1>Virtaul list</h1>
      <VirtualizedList
      items={bigData}
      itemHeight={50}
      windowHeight = {400}
      buffer={3}
      />
    </div>
  )
}

export default Home
