import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

interface ProductContextData{
   products: Product[];
   onSave: (product: Product) => void;
   onEdit: (product: Product) => void;
   onDelete: (selectableRows: Product[]) => void;
}
export interface Product{
   sku: number;
   nome: string;
   preco: string;
   categoria: string;
}
interface ProductProviderProps{
   children: ReactNode;
}

export const ProductContext = createContext({} as ProductContextData);
export function ProductProvider({ children} : ProductProviderProps) {
   const [products, setProducts] = useState<Product[]>([]);

   async function onSave(product : Product){
      //Caso já exista o codigo SKU
      const skuExist = products.filter(p => p.sku === product.sku);
      if(skuExist.length !== 0){
        throw new Error(`coidgo SKU ${product.sku} já existe!`);
      }
      if(products.length >= 1){
        setProducts([
          ...products,
          product
        ]);
      }
      else
        setProducts([product]);
      const data = {id: Number(product.sku), ...product};

      //Salvar no servidor
      await api.post('products', data);
   }
   async function onEdit(product : Product){
      // 1° passo excluir ele do vetor
      const newProducts = products.filter(p => p.sku !== product.sku);
      // 2° passo inserir com os novos valores
      newProducts.push(product);
      setProducts(newProducts);
      const data = product;
      //3° Passo salvar no servidor
      await api.put(`products/${Number(product.sku)}`, data);
   }

   async function onDelete(selectableRows : Product[]){
      setProducts(products.filter(p => !selectableRows.includes(p)));
      selectableRows.map(async (sr) => {
         await api.delete(`products/${sr.sku}`);
      });
   }

   useEffect(() => {
      async function getProductsInServer(){
         const data = await api.get('products')
         .then(res => res.data)
         .catch(() => null);
         
         if(data)
            setProducts(data);
      }
      getProductsInServer();
   }, []);
      
    return (
      <ProductContext.Provider value={{products, onSave, onEdit, onDelete}}>
          {children}
      </ProductContext.Provider>
  );
}