import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UploadWidget from "../components/UploadWidget";
function User() {
  const { usuario , resetPassword } = useAuth();

  const navigate = useNavigate();
  const [id, setId] = useState();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (usuario) {
      axios.get(`/users/${usuario.email}`).then((res) => {
        setUser(res.data);
        setId(res.data.id);
        if (res.data === "Usuario no encontrado") {
          navigate("/completarform");
        }
      });
    }
  }, [usuario]);

  const [input, setInput] = useState({
    name: user.name,
    last_name: user.last_name,
    adress: user.adress,
    phone_number: user.phone_number,
  });

  let handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  let onSubmit = (e) => {
    e.preventDefault();
    try {
      axios
        .put(`/users/${usuario.email}`, input)
        .then((res) => console.log(res));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const [todasLasCompras, setInfo] = useState([]);

  const [infoCompletaDeUna, setInfoCompleta] = useState({});
  //mpData>items/total_amount -
  async function getInfo() {
    return await axios
      .get(`/purchase/user/${id}`)
      .then((res) => setInfo(res.data));
  }
  async function getCompleteInfo() {
    if (todasLasCompras.length > 0) {
      return await axios
        .get(`/purchase/${todasLasCompras[0].id}`)
        .then((res) => setInfoCompleta(res.data));
    }
  }

  const [review, setReview] = useState([]);

  async function getReview() {
    return await axios
      .get(`/review/user/${id}`)
      .then((res) => setReview(res.data));
  }
  useEffect(() => {
    if (id) {
      getReview();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getInfo();
    }
  }, [id]);
  useEffect(() => {
    getCompleteInfo();
  }, [todasLasCompras]);

  const [name, setName] = useState([]);

  useEffect(()=>{
    const names = []
      review.forEach((e)=>{
        axios.get(`/warehouse/product/${e.WareHouse.ProductId}`)
        .then(res=>names.push(res.data[0].Product.name))
      })
    setName(names)
  },[])

  const handleReset = () => {
    let email = prompt("Escribe tu email para enviarte el link")
    if(email){
      resetPassword(email)
    }
  }
  return (
    <>
      <div className="flex flex-col">
        {" "}
        <h1 className="text-3xl text-center mt-5 tracking-tighter font-bold">
          Bienvenido {user.name} {user.last_name}
        </h1>
        <div className="flex justify-center items-center gap-5">
          {user.avatar && (
            <img
            src={user.avatar}
            alt={user.name}
            className="object-cover w-24 h-24 rounded-md"
            />
            )}
          {usuario && <UploadWidget email={usuario.email} />}
            <button className="cursor-pointer bg-gray-400 px-2 py-1 rounded-md hover:text-white duration-200" onClick={handleReset}>Cambiar contraseña</button>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col py-10">
        <section className="w-full sm:w-1/2 flex flex-col justify-center items-center gap-10">
          <h1 className="text-3xl text-center tracking-tighter font-bold">
            Quieres modificar algun dato?
          </h1>
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center px-20 py-10 bg-gray-200 rounded-md shadow-black shadow-lg items-center gap-4"
          >
            <div className="flex flex-col">
              <label className="font-bold">Nombre</label>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                value={input.name}
                placeholder={user.name}
                className="outline-none p-1 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">Apellido</label>
              <input
                onChange={handleChange}
                type="text"
                name="last_name"
                value={input.last_name}
                placeholder={user.last_name}
                className="outline-none p-1 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">Direccion</label>
              <input
                onChange={handleChange}
                type="text"
                name="adress"
                placeholder={user.adress}
                value={input.adress}
                className="outline-none p-1 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">Telefono</label>
              <input
                onChange={handleChange}
                type="number"
                name="phone_number"
                placeholder={user.phone_number}
                value={input.phone_number}
                className="outline-none p-1 rounded-md"
              />
            </div>
            <button
              className="bg-white px-10 py-2 rounded-md text-2xl hover:text-white hover:bg-black duration-300 shadow-black shadow"
              type="submit"
            >
              Modificar
            </button>
          </form>
        </section>
        <section className="w-full px-20 sm:px-4 h-[600px] sm:w-1/2 flex flex-col">
          <h1 className="text-3xl text-center my-10 tracking-tighter font-bold">
            Estas son tus compras
          </h1>
          <div className="flex flex-col gap-5 p-5 text-center overflow-y-scroll">
            {todasLasCompras.length === 0 ? (
              <h1 className="text-3xl text-center items-center justify-center flex mt-10">
                No hiciste ninguna compra
              </h1>
            ) : null}
            {todasLasCompras?.map((e, i) => (
              <div
                className="flex flex-col py-5 shadow-black shadow-sm rounded-md border-2 items-center justify-center"
                key={i}
              >
                <h2>Compra nro° {i + 1}</h2>
                <p>Realizada el dia {e.createdAt.split("").splice(0, 10)}</p>
                <p>
                  Estado de la compra:{" "}
                  {e.status}
                </p>
                <p>Total: ${e.totalprice}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="w-full h-[300px]">
        <h1 className="text-center text-4xl">
          {review.length > 0
            ? "Estos son tus comentarios en productos"
            : "No hiciste ningun comentario aún"}
        </h1>
        <div className="gap-5 w-full overflow-y-scroll h-[250px] flex flex-col">
          {review?.map((e, i) => (
            <div key={i} className="flex flex-col items-center justify-center border-2">
              <h1 className="flex flex-col items-center justify-center">Producto: <span>{e.WareHouse.Product.name}</span></h1>
              <p>Comentario: {e.comment}</p>
              <p>Rating: {e.rating}</p>
              <img src={e.WareHouse.Product.image} className="w-24 h-24" alt={e.WareHouse.Product.name} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default User;
