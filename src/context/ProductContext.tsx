import React, { createContext, ReactNode, useState } from 'react';

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
   const [products, setProducts] = useState<Product[]>([{
      sku: 1,
      nome: 'Feijão carioca Fibra 1kg',
      preco: '6,50',
      categoria: 'Feijão',
   }]);

   function onSave(product : Product){
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
   }
   function onEdit(product : Product){
      // 1° passo excluir ele do vetor
      const newProducts = products.filter(p => p.sku !== product.sku);
      // 2° passo inserir com os novos valores
      newProducts.push(product);
      setProducts(newProducts);
   }

   function onDelete(selectableRows : Product[]){
      setProducts(products.filter(p => !selectableRows.includes(p)));
   }
      
    return (
      <ProductContext.Provider value={{products, onSave, onEdit, onDelete}}>
          {children}
      </ProductContext.Provider>
  );
}