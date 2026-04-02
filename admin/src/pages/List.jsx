import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import Add from './Add'; // Adjust the path if Add.jsx is in a different folder

const List = ({ token }) => {

  const [list, setList] = useState([])

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // This is the missing function causing your error!
  const handleEdit = (item) => {
    setSelectedProduct(item);
    setShowEditModal(true);
  };

  // admin/src/pages/List.jsx

  const fetchList = async () => {
    try {
      // Change .post to .get
      const response = await axios.get(backendUrl + '/api/product/list')

      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>

      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item) => (
          <div
            key={item._id}
            className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
          >
            <img className='w-12' src={item.image[0]} alt={item.name} />
            <p>{item.name}</p>
            <p className='hidden md:block'>{item.category}</p>
            <p className='hidden md:block'>$ {item.price}</p>

            <div className='flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center'>
              {/* Edit Button */}
              <p
                onClick={() => handleEdit(item)}
                className='cursor-pointer text-blue-500 hover:underline'
              >
                Edit
              </p>

              {/* Delete Button */}
              <p
                onClick={() => removeProduct(item._id)}
                className='cursor-pointer text-red-500 text-lg hover:font-bold'
              >
                X
              </p>
            </div>
          </div>

        ))}
      </div>

      {/* --- Edit Modal --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">

            {/* Close Button in corner */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-2xl font-bold"
            >
              &times;
            </button>

            {/* Reuse your Add component in Edit Mode */}
            <Add
              token={token}
              selectedProduct={selectedProduct}
              isEdit={true}
              setShowEditModal={setShowEditModal}
              fetchList={fetchList}
            />

          </div>
        </div>
      )}
    </>
  )
}

export default List