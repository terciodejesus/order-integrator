import {
  Address,
  Customer,
  OrderItem,
  Payment,
  Shipping,
} from 'src/domain/entities';
import { Order } from 'src/domain/entities/Order';
import {
  BahnOrderAddressDTO,
  BahnOrderCustomerDTO,
  BahnOrderDTO,
  BahnOrderPaymentDTO,
  BahnOrderProductDTO,
  BahnOrderShippingDTO,
} from '../dtos/bahn-order.dto';

export class BahnOrderToDomainMapper {
  static toDomain(bahnOrderDto: BahnOrderDTO): Order {
    return {
      externalId:
        bahnOrderDto.ecommerceOrder.orderAdditionalFields.U_External_Id,
      orderNumber: bahnOrderDto.number,
      channel: bahnOrderDto.channel,
      items: bahnOrderDto.products.map((product) => this.mapOrderItem(product)),
      shipping: this.mapShipping({
        shipping: bahnOrderDto.shipping,
        quoteId: bahnOrderDto.ecommerceOrder.orderAdditionalFields.U_Id_Cotacao,
        address: bahnOrderDto.orderAddress[0],
      }),
      customer: this.mapCustomer(bahnOrderDto.customer),
      payment: this.mapPayment({
        address: bahnOrderDto.orderAddress[1],
        payment: bahnOrderDto.orderPayments[0],
        paymentGatewayId:
          bahnOrderDto.ecommerceOrder.orderAdditionalFields.paymentGatewayId,
        brand: bahnOrderDto.brandName,
        gateway: bahnOrderDto.ecommerceOrder.orderAdditionalFields.U_Gateway,
      }),
      project: bahnOrderDto.ecommerceOrder.orderAdditionalFields.U_Project_tag,
      additionalFields: bahnOrderDto.ecommerceOrder.orderAdditionalFields,
      customerAdditionalFields:
        bahnOrderDto.ecommerceOrder.customerAdditionalFields,
    };
  }

  private static mapOrderItem(item: BahnOrderProductDTO): OrderItem {
    return {
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
      gift: item.usageType === 6,
    };
  }

  private static mapShipping({
    shipping,
    quoteId,
    address,
  }: {
    shipping: BahnOrderShippingDTO;
    quoteId: string;
    address: BahnOrderAddressDTO;
  }): Shipping {
    return {
      method: shipping.method,
      price: shipping.price,
      quotedPrice: shipping.quotedPrice,
      address: this.mapAddress(address),
      quoteId: quoteId,
      deliveryDate: shipping.dueDate,
    };
  }

  private static mapAddress(address: BahnOrderAddressDTO): Address {
    return {
      name: address.name,
      street: address.street,
      streetNumber: address.number,
      complement: address.complement,
      district: address.Neighborhood,
      city: address.city,
      uf: address.Region,
      zipCode: address.zipCode,
      phone: address.phone,
      taxIdentification: address.taxIdentification,
    };
  }

  private static mapCustomer(customer: BahnOrderCustomerDTO): Customer {
    return {
      name: customer.name,
      email: customer.email,
      taxIdentification: customer.taxIdentification,
      phoneNumber: customer.phoneNumber,
    };
  }

  private static mapPayment({
    payment,
    address,
    paymentGatewayId,
    brand,
    gateway,
  }: {
    payment: BahnOrderPaymentDTO;
    address: BahnOrderAddressDTO;
    paymentGatewayId: string;
    brand: string;
    gateway: string;
  }): Payment {
    return {
      method: payment.PaymentMethod,
      total: payment.total,
      discount: payment.discount,
      installments: payment.installments,
      dueDate: payment.dueDate,
      address: this.mapAddress(address),
      subtotal: payment.subTotal,
      couponCode: payment.couponCode,
      couponDescription: payment.couponDescription,
      nsu: payment.nsu,
      tid: payment.tid,
      paymentGatewayId: paymentGatewayId,
      brand: brand,
      gateway: gateway,
    };
  }
}
