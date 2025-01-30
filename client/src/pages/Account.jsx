import { assets } from "@/assets/assets"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { userContent } from "@/context/UserContext"
import { Input } from "@/components/ui/input"
import { useCallback, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { BarChartUser } from "@/components/ui/custom/BarChartUser"
import { AreaChartUser } from "@/components/ui/custom/AreaChartUser"
import { PieChartUser } from "@/components/ui/custom/PieChartUser"

export default function Account() {

  axios.defaults.withCredentials = true
  const { backendUrl, userData } = useContext(userContent)
  
  const [openChangeUser, setOpenChangeUser] = useState(false)
  const [openChangeName, setOpenChangeName] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const [name, setName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [queries, setQueries] = useState([])
  const [selectedQuery, setSelectedQuery] = useState([])

  const email = userData.email

  const cancelChange = async (e) => {
    e.preventDefault()

    setName('')
    setOldPassword('')
    setNewPassword('')
    setOpenChangeName(false)
    setOpenChangePassword(false)
    setOpenChangeUser(false)
  }

  const submitChange = async (e) => {
    e.preventDefault()
    
    if (!name && !newPassword) {
      return toast.error('Please fill in the new information')
    }

    if (newPassword && !oldPassword) {
      return toast.error('Please fill in the old password')
    }

    if (name) {
      const { data } = await axios.post(backendUrl + '/api/auth/changeName',
        { email, name }
      )

      if (data.success) {
        setOpenChangeName(false)
        setOpenChangeUser(false)
        setName('')
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    }

    if (newPassword && oldPassword) {
      const { data } = await axios.post(backendUrl + '/api/auth/changePass',
        { email, oldPassword, newPassword }
      )

      if (data.success) {
        setOpenChangePassword(false)
        setOpenChangeUser(false)
        setOldPassword('')
        setNewPassword('')
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    }
  }

  const getQueries = async () => {
    try {
        const { data } = await axios.post(backendUrl + '/api/query/data/', 
          { email }
        )
        if (data.success) {
            setQueries(data.queries)
        } else {
            toast.error(data.error)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  const deleteQuery = async (queryId) => {
    try {
      const { data } = await axios.delete(backendUrl + `/api/query/delete/${queryId}`)
      if (data.success) {
          toast.success(data.message)
          await getQueries() // Refresh the queries list
      } else {
          toast.error(data.error)
      }
    } catch (error) {
        toast.error(error.message)
    }
  }

  useEffect(() => {
    getQueries()
  }, [email])

  const convertQuery = (dataset) => {
    const convertedQuery = {
      funda: [],
      pararius: [],
      rentola: [],
      hAnywhere: [],
      kamernet: [],
      huurwoningen: [],
    }

    dataset.forEach((set) => {
      convertedQuery[set.provider].push(set)
    })

    return convertedQuery
  }

  const handleQuerySelect = useCallback(value => {
    setSelectedQuery(convertQuery(value.queryData))
  }, [])

  return (
    <div className='relative bg-slate-100 dark:bg-gray-700 min-h-screen flex flex-col w-full'>
      <Nav />
      <div className="flex-1 overflow-auto">
        <div className='m-auto px-6 lg:px-10 xl:px-14 2xl:px-30' style={{ height: 'calc(100vh - 6rem)' }}>
          <hr className='w-full h-1 mx-auto bg-gray-200 rounded-3xl border-0' />
          <div className="grid grid-cols-1 min-[858px]:grid-cols-[1fr_auto_2fr] xl:grid-cols-[0.9fr_auto_2.1fr] min-[858px]:gap-6 w-full h-full">
            <div className="relative w-full py-0 px-1">
              <div className="*:py-2 py-2 animate-slideIn6 dark:text-muted">
                <div className="flex max-lg:flex-wrap justify-between sm:text-md text-lg">
                  <div>Email:</div>
                  <div className="font-semibold underline underline-offset-2">
                    {userData.email}
                  </div>
                </div>
                <div className="flex max-lg:flex-wrap justify-between sm:text-md text-lg">
                  <div>Name:</div>
                  <div className="font-semibold underline underline-offset-2">
                  {userData.name}
                  </div>
                </div>
              </div>
              <div>
                <Button onClick={() => setOpenChangeUser(true)} className={`${openChangeUser ? 'scale-y-0 opacity-0 h-0' : ''} w-full py-2.5 rounded-lg text-white font-medium transition-all ease-in-out duration-500 animate-slideIn6`}>
                  Change details
                </Button>
                <hr className={`${!openChangeUser ? 'scale-y-300 opacity-0 hidden' : 'opacity-100'} w-full h-1 -mt-4 mx-auto rounded-3xl bg-gray-200 border-0 transition-all ease-in-out duration-500`} />
              </div>
              <div className="pt-2">
                <div className={`${openChangeUser ? 'opacity-100' : 'opacity-0 h-0 [&_*]:h-0 [&_*]:py-0 [&_*]:pointer-events-none'} sm:text-md text-lg transition-all ease-in-out duration-500 dark:text-white`}>
                  <div className={`${openChangeUser ? 'opacity-100 py-2' : 'opacity-0 h-0 py-0'}`}>What do you want to change?</div>
                  <div className={`${(openChangeName || openChangePassword) ? 'opacity-0 h-0 py-0 m-0 text-[0px] [&_*]:hidden [&_*]:pointer-events-none [&_*]:h-0 [&_*]:py-0' : 'py-2'} flex justify-between items-center transition-all ease-in-out duration-500`}>
                    <Button onClick={() => setOpenChangeName(true)} className='w-24'>Name</Button> OR <Button onClick={() => setOpenChangePassword(true)} className='w-24'>Password</Button>
                  </div>
                  <div className={`${openChangeName ? 'py-2' : 'scale-x-0 origin-left opacity-0 h-0 py-0'} relative flex items-center transition-all ease-in-out duration-500`}>
                    <div className='flex items-center gap-3 w-full px-5 py-1 rounded-lg bg-white border-2 border-slate-900'>
                      <img src={assets.person_b} alt="Name" />
                      <Input 
                        type="text"
                        placeholder={userData.name} 
                        className='bg-transparent outline-none border-none rounded-lg min-[858px]:text-md focus-visible:ring-0 dark:text-primary' 
                        value={name} 
                        onChange={e => setName(e.target.value)} />
                    </div>
                  </div>
                  <div className={`${openChangePassword ? 'py-2' : 'scale-x-0 origin-right opacity-0 h-0 py-0'} relative flex items-center transition-all ease-in-out duration-500`}>
                    <div className='flex items-center gap-3 w-full px-5 py-1 rounded-lg bg-white border-2 border-slate-900'>
                      <img src={assets.personKey_b} alt="Password" />
                      <Input 
                        type="password" 
                        placeholder='Old password'
                        className='bg-transparent outline-none border-none rounded-lg min-[858px]:text-md focus-visible:ring-0 dark:text-primary' 
                        value={oldPassword} 
                        onChange={e => setOldPassword(e.target.value)} />
                    </div>
                  </div>
                  <div className={`${openChangePassword ? 'py-2' : 'scale-x-0 origin-right opacity-0 h-0 py-0'} relative flex items-center transition-all ease-in-out duration-500`}>
                    <div className='flex items-center gap-3 w-full px-5 py-1 rounded-lg bg-white border-2 border-slate-900'>
                      <img src={assets.passKey_b} alt="Password" />
                      <Input 
                        type="password" 
                        placeholder='New password' 
                        className='bg-transparent outline-none border-none rounded-lg min-[858px]:text-md focus-visible:ring-0 dark:text-primary' 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-1">
                  <Button onClick={(e) => submitChange(e)} onKeyDown={e => e.key === 'Enter' ? (e) => submitChange(e) : ''} className={`${openChangeUser && (openChangeName || openChangePassword) ? '' : 'scale-y-0 hidden'} mt-4 w-[48%] min-w-[130px] py-2.5 rounded-lg text-white font-medium transition-all ease-in-out duration-500`}>
                    Change {openChangeName ? 'Name' : 'Password'}
                  </Button>
                  <Button onClick={(e) => cancelChange(e)} className={`${openChangeUser && (openChangeName || openChangePassword) ? '' : 'scale-y-0 hidden'} mt-4 w-[48%] py-2.5 rounded-lg text-white font-medium transition-all ease-in-out duration-500`}>
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="min-[858px]:absolute min-[858px]:bottom-2 max-[858px]:hidden w-full text-center">
                <hr className='w-full h-1 mx-auto my-4 rounded-3xl bg-gray-200 border-0' />
                <div className="dark:text-white animate-slideUp6">
                  You can <a href="https://donate.stripe.com/6oE2bs0Fg99sfrqaEE" target="_blank" className="cursor-pointer text-chart-2 hover:text-chart-1 group transition duration-300">
                    <span className="bg-left-bottom bg-gradient-to-r from-chart-1 to-chart-1 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">donate</span>
                  </a> to support the project!
                </div>
              </div>
            </div>
            <div className="max-[858px]:hidden w-1 bg-gray-200 rounded-3xl mt-[1.5vh]"></div>
            <hr className='min-[858px]:hidden rounded-3xl w-full h-1 mx-auto my-4 bg-gray-200 border-0' />
            <div className="relative w-full py-2 pt-2.5 px-1 gap-2 grid grid-rows-[2.5rem_auto_auto] max-lg:grid-flow-row text-center z-10">
              <Select name="radiusDrop" id="radiusDrop" onValueChange={handleQuerySelect}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white min-w-full animate-slideIn4 transition-all duration-500 ease-in-out text-md">
                  <SelectValue placeholder="Select query to show..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Your queries</SelectLabel>
                    { queries.length > 0 ? (
                      queries.map((query) => {
                        const city = query.city.charAt(0).toUpperCase() + query.city.slice(1).toLowerCase()
                        const providers = query.providers.map(provider => 
                          provider.charAt(0).toUpperCase() + provider.slice(1)).join(", ")

                        return (
                          <SelectItem 
                          key={query._id} 
                          value={query}>
                          {city}: {providers}
                        </SelectItem>
                        )
                      })
                    ) : (
                      <SelectItem value="no-queries" disabled>
                        No queries available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(auto,_0.7fr)] gap-2">
                <BarChartUser queryData={selectedQuery} />
                <PieChartUser queryData={selectedQuery}/>
              </div>
              <div className="w-full max-[858px]:mb-20">
                <AreaChartUser />
              </div>
              <div className="max-[858px]:absolute max-[858px]:bottom-4 min-[858px]:hidden w-full text-center">
                <hr className='w-full h-1 mx-auto my-4 rounded-3xl bg-gray-200 border-0' />
                <div className="dark:text-white animate-slideUp6">
                  You can <a href="https://donate.stripe.com/6oE2bs0Fg99sfrqaEE" target="_blank" className="cursor-pointer text-chart-2 hover:text-chart-1 group transition duration-300">
                  <span className="bg-left-bottom bg-gradient-to-r from-chart-1 to-chart-1 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">donate</span>
                  </a> to support the project!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}