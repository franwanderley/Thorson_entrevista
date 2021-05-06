import React, { createContext, ReactNode, useState } from 'react';

interface ProductContextData{
   products: Product[];
   setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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
      
    return (
      <ProductContext.Provider value={{products, setProducts}}>
          {children}
      </ProductContext.Provider>
  );
}