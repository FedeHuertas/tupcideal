import React, { useEffect, useState } from "react";
import Select from "react-select";
import SliderRange from "../components/SliderRange";
import Pagination from "../components/Pagination";
import { useDispatch,useSelector} from 'react-redux';
import {getAll} from '../redux/actions'

function Productos() {

  const allProducts = useSelector((state)=>state.products.allProducts);

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getAll())
  },[])

  const [currentPage, setCurrentPage] = useState(1);

  const productPerPage = 6;

  const lastProductOfPage = currentPage * productPerPage;

  const firstProductOfPage = lastProductOfPage - productPerPage;

  const currentProducts = allProducts.slice(
    firstProductOfPage,
    lastProductOfPage
  );

  const pagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const set = new Set();
  allProducts.map((e) => set.add(e.categories[0]));
  const handleSelectChange = (event) => {
    console.log(event);
  };

  return (
    <div className="flex sm:flex-row flex-col">
      <section className="p-2 sm:px-5 border-b-2 sm:border-b-0 sm:border-r-2 rounded-xl w-full sm:w-2/4">
        <h1 className="text-xl sm:text-2xl mb-2">Filtrar por:</h1>
        <hr />
        <div className="flex flex-col gap-5 p-5">
          <Select
            placeholder="Categoria"
            isClearable
            options={Array.from(set).map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={handleSelectChange}
            className="z-50 cursor-pointer"
          />
          <Select
            placeholder="Marca"
            isClearable
            options={allProducts.map((item) => ({
              label: item.brand,
              value: item.brand,
            }))}
            onChange={handleSelectChange}
            className="z-30 cursor-pointer"
          />
          <SliderRange />
        </div>
      </section>
      <section className="grid grid-cols-3 w-full sm:my-10">
        {currentProducts.map((e, i) => (
          <div
            key={i}
            className="h-[200px] justify-center items-center text-center my-20 mx-5 border rounded-lg flex flex-col gap-5"
          >
            <img src={e.image} alt="" className="w-24 h-24 object-contain" />
            <h1>{e.name.slice(0, 30) + "..."}</h1>
            <p>${e.price}</p>
            <button className="bg-black p-5 text-white rounded-md">
              Ver mas
            </button>
          </div>
        ))}
      </section>
        <div className="flex justify-center items-center sm:absolute right-[12%]">
          <Pagination
          productPerPage={productPerPage}
          allProducts={allProducts.length}
          pagination={pagination}
          currentPage={currentPage}
          />
        </div>
    </div>
  );
}

export default Productos;