export default function TableRow(props) {
  return (
    <div className='text-white flex gap-3 p-2 border-x-1 w-full rounded-sm border-zinc-700 justify-evenly text-left text-sm md:text-xl'>
        <h4>{props.site_name}</h4>
        <h4>{props.site_password}</h4>
        <h4 className='md:visible invisible'>{props.site_url}</h4>
    </div>
  )
}