import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import { getFiltered2 } from "../redux/actions"
import { useAuth } from "../context/authContext";
import swal from 'sweetalert';
import "../components/NavBar/Signin.css"


function Admin() {
  const dispatch = useDispatch();
  const filtered = useSelector((state) => state.products.productsFiltered2);
  const { signUp } = useAuth();
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState();
  const [component, setComponent] = useState({});

  const [product, setProduct] = useState({
    name: "",
    categories: "",
    price_usd: "",
    rating: "",
    rating_count: "",
    image: "",
  });

  const [seller, setSeller] = useState({
    store_name: "",
    adress: "",
    email: "",
    phone_number: "",
    password: "",
  });

  function axion() {
    axios.get("/users").then((res) => {
      let filtrados=(res.data.filter((e) => e.isAdmin !== true));
      filtrados.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      setUsers(filtrados)
    });
  }

  function axionSellers() {
    axios.get("/sellers").then((res) => {
      res.data.sort(function (a, b) {
        if (a.store_name > b.store_name) {
          return 1;
        }
        if (a.store_name < b.store_name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      setSellers(res.data);
    });
  }

  let handleDelete = async (e) => {
    await axios.delete(`/users/${e}`);
    axion();
  };
  let handleDeleteSeller = async (e) => {
    await axios.delete(`/sellers/${e}`);
    axionSellers();
  };

  let handleBan = async (e) => {
    await axios.put(`/users/${e}`, { ban: true });
    axion();
  };

  let handleDesBan = async(e) => {
    await axios.put(`/users/${e}`, { ban: false });
    axion();
  };

  let handleBanSeller = async (e) => {
    await axios.put(`/sellers/${e}`, { ban: true });
    axionSellers();
  };

  let handleDesBanSeller = async (e) => {
    await axios.put(`/sellers/${e}`, { ban: false });
    axionSellers();
  };

  let handleSelect = (e) => {
    const { value } = e.target;
    if (value) {
      const result = filtered.find((f) => f.id === value);
      setComponent(result);
    }
  };

  const productHandlerChange = (e) => {
    const value = { ...product, [e.target.name]: e.target.value };
    setProduct(value);
  };

  const sellerHandlerChange = (e) => {
    const value2 = { ...seller, [e.target.name]: e.target.value };
    setSeller(value2);
  };

  let onClickDel = async (e) => {
    const answer= await axios.delete(`/products/${component.id}`);
    if(answer.data.resp===1){
      swal("Great",answer.data.message,"success");
    }else{
      swal("Sorry",answer.data.message,"error");
    }
    axion();
  };

  let onClickEdit = async (e) => {
    await axios.put(`/products/${component.Product.id}`);
    axion();
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const resp= await axios.post("/products", product);
    console.log(resp);
    if(resp.data.resp===0){
      swal("Great",resp.data.message,"error");
    }else{
      swal("Great","The product was created successfully","success");
    }
    axion();
  };
  const onSubmitSeller = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(seller.email, seller.password);
      await axios
        .post("/sellers", seller)
        .then((res) => console.log(res.data))
        .catch((e) => console.log(e));
      // navigate("/login");
      swal("Ok!", "Vendedor creado exitosamente", "success");
    } catch (error) {
      if (error.code === "auth/missing-email")
        setError("Especifique un correo");
      if (error.code === "auth/weak-password")
        setError("La contraseña debe tener mas de 6 caracteres");
      if (error.code === "auth/invalid-email")
        setError("Ingrese un correo valido");
      if (error.code === "auth/email-already-in-use")
        setError("Usuario ya existente");
      if (error.code === "auth/internal-error") setError("Contraseña invalida");
    }
  };

  const [disable,setDisable] = useState(true)

  useEffect(()=>{
    if(seller.store_name !== "" && seller.adress !== "" && seller.email !== "" 
    && seller.password !== "" && seller.phone_number !== ""){
     setDisable(false)
    }else{
      setDisable(true)
    }
  },[seller])

  useEffect(() => {
    axion();
    axionSellers();
  }, []);
  return (
    <div className="min-h-[100vh] flex ">
      <section className="w-2/5 min-w-[28%] bg-gray-300 h-auto sm:h-screen text-center">
        <h1 className="p-4 text-2xl">Tabla de usuarios</h1>
        {users &&
          users.map((e, i) => (
            <div
              key={i}
              className="border-2 flex gap-10 justify-center items-center rounded"
            >
              <p className="text-xl font-medium">{e.name} </p>
              <button
                className="border-2 bg-red-400 p-1 justify-center rounded"
                onClick={() => handleDelete(e.email)}
              >
                Eliminar
              </button>{" "}
              {e.isBanned && (
                <button
                  className="border-2 bg-green-400 rounded p-1 justify-center"
                  onClick={() => handleDesBan(e.email)}
                >
                  Desbanear
                </button>
              )}
              {!e.isBanned && (
                <button
                  className="border-2 rounded bg-red-400 p-1 justify-center"
                  onClick={() => handleBan(e.email)}
                >
                  Banear
                </button>
              )}
            </div>
          ))}

        <div>
          <h1 className="p-4 text-2xl">Tabla de vendedores</h1>
          {sellers &&
            sellers.map((e, i) => (
              <div
                key={i}
                className="border-2 flex gap-10 justify-center items-center rounded"
              >
                <p className="text-xl font-medium">{e.store_name} </p>
                <button
                  className="border-2 bg-blue-400 p-1 justify-center rounded"
                  onClick={() => handleDeleteSeller(e.email)}
                >
                  Eliminar
                </button>{" "}
                {e.isBanned && (
                  <button
                    className="border-2 bg-blue-400 rounded p-1 justify-center"
                    onClick={() => handleDesBanSeller(e.email)}
                  >
                    Desbanear
                  </button>
                )}
                {!e.isBanned && (
                  <button
                    className="border-2 rounder-2 bg-blue-400 p-1 justify-center"
                    onClick={() => handleBanSeller(e.email)}
                  >
                    Banear
                  </button>
                )}
              </div>
            ))}
          <form className="flex justify-center" onSubmit={onSubmitSeller}>
            <div className="flex flex-col">
              <h1 className="p-4 text-2xl">Crear Vendedor</h1>
              <label className="flex justify-between">
                Store Name:
                <input
                  className=" border-2 border-black h-8 ml-4"
                  type="text"
                  name="store_name"
                  value={seller.store_name}

                  onChange={sellerHandlerChange}
                />
              </label>
              <label className="flex justify-between">
                Adress:
                <input
                  className=" border-2 border-black h-8 ml-4"
                  type="text"
                  name="adress"
                  value={seller.adress}
                  onChange={sellerHandlerChange}
                />
              </label>
              <label className="flex justify-between">
                email:
                <input
                  className=" border-2 border-black h-8 ml-4"
                  Style="text-transform:lowercase"
                  type="text"
                  name="email"
                  value={seller.email}
                  onChange={sellerHandlerChange}
                />
              </label>
              <label className="flex justify-between">
                Phone Number:
                <input
                  className=" border-2 border-black h-8 ml-4"
                  type="text"
                  name="phone_number"
                  value={seller.phone_number}
                  onChange={sellerHandlerChange}
                />
              </label>
              <label className="flex justify-between">
                Password:
                <input
                  className=" border-2 border-black h-8 ml-4"
                  type="text"
                  name="password"
                  value={seller.password}
                  onChange={sellerHandlerChange}
                />
              </label>

              <input
                className="border-2 bg-blue-400 rounded p-1 justify-center self-end mt-4"
                type="submit"
                value="Submit"
                disabled={disable}
                onClick={onSubmitSeller}
              />
            </div>
          </form>
        </div>
      </section>
      <section className="flex">
        {/* ------------------------------------------ */}
        <section className="w-2/5 min-w-[50%] bg-gray-300 h-auto sm:h-screen text-center">
          <div className="ml-4 justify-center ">
            <h1 className="p-4 text-2xl">Editar o Eliminar Componente </h1>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <button
                  className="border-2 border-stone-400 bg-gray-200 hover:bg-zinc-400 rounded p-1 justify-center"
                  onClick={() => dispatch(getFiltered2("CPU"))}>
                  CPU
                </button>
              </div>
              <div>
                <button
                  className="border-2 border-stone-400 bg-gray-200 hover:bg-zinc-400 rounded p-1 justify-center"
                  onClick={() => dispatch(getFiltered2("Case"))}
                >
                  CASES
                </button>
              </div>
              <div>
                <button
                  className="border-2 border-stone-400 bg-gray-200 hover:bg-zinc-400 rounded p-1 justify-center"
                  onClick={() => dispatch(getFiltered2("VideoCard"))}
                >
                  VIDEO CARD
                </button>
              </div>
              <div>
                <button
                  className="border-2 border-stone-400 bg-gray-200 hover:bg-zinc-400 rounded p-1 justify-center"
                  onClick={() => dispatch(getFiltered2("Motherboard"))}
                >
                  MOTHER BOARD
                </button>
              </div>

              <div>
                <button
                  className="border-2 border-stone-400 bg-gray-200 hover:bg-zinc-400 rounded p-1 justify-center"
                  onClick={() => dispatch(getFiltered2("Memory"))}
                >
                  MEMORY CARD
                </button>
              </div>
              <div>
                <button
                  className="border-2 border-stone-400 bg-gray-200 hover:bg-zinc-400 rounded p-1 justify-center"
                  onClick={() => dispatch(getFiltered2("PowerSupply"))}
                >
                  POWER SUPPLY
                </button>
              </div>
              <div>
                <button
                  className="border-2 border-stone-400 bg-gray-200 hover:bg-zinc-400 rounded p-1 justify-center"
                  onClick={() => dispatch(getFiltered2("InternalHardDrive"))}
                >
                  INTERNAL HARD DRIVE
                </button>
              </div>
            </div>
            <div className="m-4 border-3">
              <select name="" id="" onChange={handleSelect}>
                <option value="">Elige tu producto</option>
                {filtered.map((f, i) => {
                  return (
                    <option key={i} value={f.id}>
                      {f.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="border-2 bg-gray-100 rounded p-5">
              <h2>Name: {component?.name}</h2>
              <img src={component?.image} alt={component?.name} width="120" />
              <h3>Category {component?.categories}</h3>
              <h3>Rating {component?.rating}</h3>
              <button
                className="border-2 bg-gray-400 rounded p-1 justify-center"
                onClick={onClickDel}
              >
                Eliminar
              </button>
              <button
                className="border-2 bg-gray-400 rounded p-1 justify-center"
                onClick={onClickEdit}
              >
                Editar
              </button>
            </div>
          </div>
         
        </section>
        <section>
           {/* ------------------------------------------ */}
           <div>
            <h1 className="p-4 text-2xl">Tabla de productos</h1>
            <div>
              <form className="flex" onSubmit={onSubmit}>
                <div className="flex">
                  <h1 className="p-4 text-2xl">Crear producto</h1>
                  <div className="flex flex-wrap flex-row-reverse mr-10">
                    <label>
                      <span>Name:</span>
                      <input
                        className=" border-2 border-black h-8 ml-4"
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={productHandlerChange}
                      />
                    </label>
                    <label>
                      Categories:
                      <input
                        className=" border-2 border-black h-8 ml-4"
                        type="text"
                        name="categories"
                        value={product.categories}
                        onChange={productHandlerChange}
                      />
                    </label>
                    <label>
                      Price_USD:
                      <input
                        className=" border-2 border-black h-8 ml-4"
                        type="text"
                        name="price_usd"
                        value={product.price_usd}
                        onChange={productHandlerChange}
                      />
                    </label>
                    <label>
                      Rating:
                      <input
                        className=" border-2 border-black h-8 ml-4"
                        type="text"
                        name="rating"
                        value={product.rating}
                        onChange={productHandlerChange}
                      />
                    </label>
                    <label>
                      Rating Count:
                      <input
                        className=" border-2 border-black h-8 ml-4"
                        type="text"
                        name="rating_count"
                        value={product.rating_count}
                        onChange={productHandlerChange}
                      />
                    </label>
                    <label>
                      Image:
                      <input
                        className=" border-2 border-black h-8 ml-4"
                        type="text"
                        name="image"
                        value={product.image}
                        onChange={productHandlerChange}
                      />
                    </label>
                    <input
                      className="border-2 bg-gray-400 rounded p-1 justify-center mr-4"
                      type="submit"
                      value="Submit"
                      onClick={onSubmit}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default Admin;