import { Product } from '../context/ProductContext';

export function Validar(product: Product){
   //trocar , por ,
   const arrPreco = product.preco.split(',');
   const valor = Number( arrPreco.join('.') );
   if(!valor){
      throw new Error('Apenas numeros são aceitos');
   }
   if(valor <= 0){
      throw new Error('Preços iguais ou menor do que 0 não são permitidos');
   }
   if(product.sku <= 0){
      throw new Error('Codigo SKU iguais ou menor do que 0 não são permitidos');
   }
   if(product.sku.toString().includes('.') || product.sku.toString().includes(',')){
      throw new Error('Pontos e Virgulas não são permitidos no codigo SKU');
   }
   if(product.nome.length < 5){
      throw new Error('Nome deve ser maior que cincos caracteres');
   }
}