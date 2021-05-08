import React, {
   useState, useEffect, useMemo, ChangeEvent, useContext
} from 'react';
import { Checkbox } from '@material-ui/core';
 import DataTable from 'react-data-table-component';
 import swal from 'sweetalert';
 
 import { ProductContext, Product } from '../context/ProductContext';
 import { Header } from '../components/Header';
 import {
   customStyles, DivDatatable, DivMain 
 } from '../styles/Style';
 import { InputSearch } from '../components/InputSearch';
 import { ButtonRemove } from '../components/ButtonRemove';
import { FormProduct } from '../components/FormProduct';
import { ModalDetails } from '../components/ModalDetail';


export function Home(){
  const {products, onDelete} = useContext(ProductContext);
  const [productEditable, setProductEditable] = useState<Product>();
  const [selectableRow, setSelectableRow] = useState<Product[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  //Para saber se o formulario está criando um novo produto ou editando um produto existente
  const [isEditable, setIsEditable] = useState(false);

  //As colunas da Tabela
  const columns = useMemo(() => [
    {
      name: 'SKU',
      selector: 'sku',
      sortable: false,
    },
    {
      name: 'Nome',
      selector: 'nome',
      sortable: true,
    },
    {
      name: 'Preço R$',
      selector: 'preco',
      sortable: true,
    },
    {
      name: 'Categoria',
      selector: 'categoria',
      sortable: true,
    },
  ],[]);
  
  const Loading = (
    <h3>Carregando Produtos...</h3>
  );

  async function deleteProduct(){
    let isDelete = false;

    await swal({
      title: "Você tem certeza de apagar esses produtos?",
      icon: "warning",
      dangerMode: true,
      buttons: ['Não', 'Sim'],
    })
    .then((willDelete) => isDelete = willDelete);
    if (isDelete) {
      onDelete(selectableRow);
      
      swal("Poof! Seu Produto foi apagado!", {
        icon: "success",
      }).then(() => {
        setSelectableRow([]);
        setToggleCleared(oldValue => !oldValue);
      });
    } else {
      swal("Seu Produto não foi apagado!").then(() => {
        setSelectableRow([]);
        setToggleCleared(oldValue => !oldValue);
      });
    }
  }
  function openModal(row : Product){
    ModalDetails({ product : row, editProduct});
  }
  function editProduct(row: Product){
    setProductEditable(row);
    setIsEditable(true);
  }
  function filterProducts(e : ChangeEvent<HTMLInputElement>){
    let search = String(e.target.value);
    search =  search.toUpperCase();
    setFilteredProducts(
      products.filter(p => p.nome.toUpperCase().indexOf(search) !== -1)
    ); 
  }
  
  //Assim que muda os products muda também o filteredPreoducts
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
   <>
      <Header/>
      <DivMain >
         <FormProduct 
            isEditable={isEditable} 
            setIsEditable={setIsEditable} 
            product={productEditable && productEditable}
         />
         <DivDatatable>

            <DataTable 
               title="Todos os Produtos" 
               data={filteredProducts}
               columns={columns}
               striped
               customStyles={customStyles}
               theme="dark"
               responsive
               actions={(<InputSearch filterProducts={filterProducts} />)}
               selectableRows
               progressPending={products.length <= 1}
               progressComponent={Loading}
               selectableRowsComponent={Checkbox}
               onSelectedRowsChange={state => setSelectableRow(state.selectedRows)}
               onRowClicked={row => openModal(row)}
               pagination
               clearSelectedRows={toggleCleared}
               contextActions={(<ButtonRemove deleteProduct={deleteProduct}/>)}
            />
        </DivDatatable>
      </DivMain>
   </>
  );

}