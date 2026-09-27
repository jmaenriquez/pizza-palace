import React from 'react'
import Table from '../../components/reusable/Table'
import Button from '../../widgets/Button'
import Fields from '../../widgets/Fields'
import { useHeaderData } from '../../utils/hooks/useHeaderData' 
import { LuSearch } from 'react-icons/lu'

interface Order{
  id: string
  name: string
  item: string
  total: string
  status: string
  actions: string
  [key: string]: string | number
}

function Orders() {

  const orderItems: Order[] = [
    { id: 'ODR-111', name:'John Doe', item:'Emperor Supreme', total:'₱304', status: 'Preparing', actions: 'View'  },
    { id: 'ODR-112', name:'Kelly Clarkson', item:'Emperor Supreme', total:'₱304', status: 'Out for Delivery', actions: 'View'  },
    { id: 'ODR-113', name:'Erick Lee', item:'Emperor Supreme', total:'₱304', status: 'Delivered', actions: 'View'  },
    { id: 'ODR-114', name:'Jarred Simpson', item:'Emperor Supreme', total:'₱304', status: 'Picked Up', actions: 'View'  },
    { id: 'ODR-115', name:'John Doe', item:'Emperor Supreme', total:'₱304', status: 'Pending', actions: 'View'  },
    { id: 'ODR-116', name:'John Doe', item:'Emperor Supreme', total:'₱304', status: 'Canceled', actions: 'View'  }
  ];

  const filterOpt = [
    'All',
    'Pending',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Delivered',
    'Picked Up'
  ];

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [search, setSearch] = React.useState('');
  const [filterIndex, setFilterIndex] = React.useState('All');

  const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setSearch(e.target.value )
  }

  React.useEffect(()=>{
    setOrders(orderItems)
  }, [])

  useHeaderData('Orders')

  return (
    <div className='px-12 pb-12 w-full'>
        <div className='flex flex-row justify-between xl:flex-col w-full gap-4 mb-4'>

          <Fields.Input
            icon={LuSearch}
            name='search'
            type='text'
            value={search}
            placeholder='Search order number, customer name, or item...'
            onChange={searchOnChange}
          />

          <div className='flex gap-4'>
            {
              filterOpt.map((filter) => 
              
                <button
                  key={filter}
                  className={`hidden xl:inline border border-gray-300 text-gray-400 py-1 px-4 rounded-xl cursor-pointer
                    ${ filterIndex === filter ? 'bg-primary text-white border-primary' : ''}
                    `}
                  onClick={() => {setFilterIndex(filter)}}
                >
                  {filter}
                </button>
                
              )
            }

            <div className=' xl:hidden'>
              <Fields.Select
                name='filter'
                value={filterIndex}
                optionsArray={filterOpt}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setFilterIndex(e.target.value)}}
              />
            </div>
          </div>
        </div>

        {/* Web View */}
        <div className='hidden md:flex'>
          <Table
            head={['Order Id', 'Customer', 'Item', 'Total', 'Status', 'Action']}
            body={orders}
            columns={['id', 'name', 'item', 'total', 'status', 'actions']}
          />
        </div>

        {/* Mobile view */}
        <div className='w-full md:hidden grid gap-4'>
          {
            orders.map(ord => 
              
              // Card
              <div 
                key={ord.id}
                className='w-full border grid gap-4 border-foreground/20 p-4 shadow-md rounded-xl'
              >
                <div className='w-full grid grid-cols-2 items-center'>
                  <h1 className='text-lg font-semibold'>{ord.item}</h1> 
                  <div className='flex justify-end'>
                    <div className={`text-xs text-background rounded-full p-1 
                      ${ord.status === 'Pending' || ord.status === 'Preparing' ? 'bg-secondary'
                        :
                        ord.status === 'Ready' || ord.status === 'Picked Up' || ord.status === 'Delivered' || ord.status === 'Out for Delivery' ? 'bg-tertiary' 
                        :
                        ord.status === 'Canceled' ? 'bg-primary' : 'bg-gray-400'
                      }
                      `}
                    >
                        {ord.status}
                    </div>                 
                  </div>
                  <h2>{ord.name}</h2>

                  <div className='flex justify-end'>
                    <h2>{ord.id}</h2>
                  </div>
                  <p>{ord.total}</p>
                </div>
                <div>
                  <Button.Hollow
                    name ={ord.actions}
                    type='button'
                    onClick={() => console.log('View is Clicked') }
                  />
                </div>
              </div>
            )
          }
        </div>

    </div>
  )
}

export default Orders