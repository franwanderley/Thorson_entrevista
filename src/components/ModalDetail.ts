import swal from 'sweetalert';
import { Product } from '../context/ProductContext';

interface ModalDetailsProps{
   product : Product;
   editProduct: (product: Product) => void;
};

export function ModalDetails({product, editProduct} : ModalDetailsProps){
   swal({
      title: 'Detalhes do produto',
      text: `Sku: ${product.sku} \n Nome: ${product.nome} \n Preço R$ ${product.preco} \n Categoria: ${product.categoria}`,
      buttons: {
        confirm: {
          text: '🖋️  Editar',
          value: true,
          visible: true,
          className: "",
          closeModal: true
        },
      },
      icon: 'info',
    }).then((value) => {
      if(value){
         editProduct(product);
      }
    });
}