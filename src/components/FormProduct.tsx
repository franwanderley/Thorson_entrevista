import { 
   Button, InputLabel, MenuItem, Select, TextField 
} from '@material-ui/core';
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import swal from 'sweetalert';
import { categorias } from '../libs/categoria';
import { FormMain } from '../styles/Style';
import { Product, ProductContext } from './../context/ProductContext';

interface FormProductProps{
   product? : Product;
   isEditable: boolean;
   setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FormProduct({product, isEditable, setIsEditable}: FormProductProps){
   const {onEdit, onSave} = useContext(ProductContext);
   const [sku, setSku] = useState<number>();
   const [nome, setNome] = useState<string>();
   const [preco, setPreco] = useState<string>();
   const [categoria, setCategoria] = useState<string>();

   function handleSubmit(form : FormEvent){
      form.preventDefault();
      const newProduct = { 
         sku: sku || 0,
         nome: nome || '',
         preco: preco || '', 
         categoria: categoria || '' 
      };

      if(isEditable){
         onEdit(newProduct);
         setIsEditable(false);
      }
      else{
         try{
            onSave(newProduct);
         }catch(error){
            swal({
               title: 'Não foi possivel salvar o produto',
               text: `Codigo SKU ${sku} já existe`,
               icon: 'warning',
            });
         }
      }
      //Limpar os campos
      setSku(0);
      setNome('');
      setPreco('');
      setCategoria('');
  }

  useEffect(() => {
     if(isEditable){
        setSku(product?.sku);
        setNome(product?.nome);
        setPreco(product?.preco);
        setCategoria(product?.categoria);
     }
  }, [product,isEditable]);

   return (
      <FormMain onSubmit={handleSubmit} >
          <TextField 
            style={{marginBottom: 10, width: '20%'}}
            id="standard-basic"
            value={sku}
            type="number"
            label="codigo do SKU"
            onChange={e => setSku(Number(e.target.value))} 
            required
          />
          <TextField
            style={{marginBottom: 10, width: '20%'}} 
            id="standard-basic"
            value={nome} 
            type="text" 
            label="Nome do Produto"
            onChange={e => setNome(e.target.value)} 
            required
          />
          <TextField
            style={{marginBottom: 10, width: '20%'}} 
            id="standard-basic" 
            value={preco}
            type="text" 
            label="Preço"
            onChange={e => setPreco(e.target.value)}
            required
          />
        <InputLabel id="demo-simple-select-label" style={{marginBottom: 10, width: '20%'}}>Escolha uma Categoria</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categoria}
          style={{marginBottom: 15, width: '20%'}}
          onChange={e => setCategoria(e.target.value as string)}
          required
        >
          {categorias.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" type="submit" color="primary">
          <FaSave style={{marginRight: 5}}/> Salvar
        </Button>
        </FormMain>
   );
}