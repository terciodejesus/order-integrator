import { Address, Order, OrderItem } from 'src/domain/entities';
import {
  BahnOrderRequestAddressDTO,
  BahnOrderRequestCustomerDTO,
  BahnOrderRequestDTO,
  BahnOrderRequestPaymentDTO,
  BahnOrderRequestProductDTO,
  BahnOrderRequestShippingDTO,
} from '../dtos';
import {
  BahnOrderGoupCode,
  BahnSalesPersonCode,
  BahnUsageType,
  BahnWarehouseCode,
} from '../enums';

export class BahnOrderToRequestMapper {
  static toRequest(order: Order): BahnOrderRequestDTO {
    return {
      ecommerceName: 'Integrações API',
      channel: order.channel,
      number: order.orderNumber,
      purchaseDate: order.createdAt,
      sellerName: '',
      brandName: order.payment.brand ?? '',
      warehouseCode: BahnWarehouseCode.PRIME,
      additionalFields: '',
      orderAdditionalFields: this.mapOrderAdditionalFields(order),
      customerAdditionalFields: this.mapCustomerAdditionalFields(),
      shipping: this.mapShipping(order),
      payment: this.mapPayment(order),
      customer: this.mapCustomer(order),
      products: order.items.map((item) => this.mapOrderItem(item)),
    };
  }

  /**
   * Maps customer information
   */
  private static mapCustomer(order: Order): BahnOrderRequestCustomerDTO {
    return {
      taxIdentification: order.customer.taxIdentification,
      email: order.customer.email,
      name: order.customer.name,
      phoneNumber: order.customer.phoneNumber,
      additionalFields: '',
    };
  }

  /**
   * Maps address information
   */
  private static mapAddress(address: Address): BahnOrderRequestAddressDTO {
    return {
      ibgeCode: '',
      name: address.name,
      street: address.street,
      number: address.streetNumber,
      complement: address.complement ?? '',
      district: address.district,
      city: address.city,
      country: 'BR',
      uf: address.uf,
      zipCode: address.zipCode,
      phone: address.phone,
      mobile: '',
      taxIdentification: address.taxIdentification ?? '',
      addressType: '',
    };
  }

  /**
   * Maps payment information
   */
  private static mapPayment(order: Order): BahnOrderRequestPaymentDTO {
    return {
      additional: 0,
      address: this.mapAddress(order.payment.address),
      couponCode: order.payment.couponCode ?? '',
      couponDescription: order.payment.couponDescription ?? '',
      creditCardBrand: order.payment.brand ?? '',
      currency: 'R$',
      dueDate: order.payment.dueDate ?? '',
      discount: order.payment.discount ?? 0,
      installments: order.payment.installments ?? 1,
      giftVoucher: '',
      method: `${order.payment.method === 'credit_card' ? order.payment.brand : 'Pix'} - ${order.payment.gateway}`,
      nsu: String(order.payment.nsu),
      subTotal: order.payment.subtotal ?? 0,
      tid: order.payment.tid ?? '',
      total: order.payment.total ?? 0,
      transactionCode: '',
    };
  }

  /**
   * Maps shipping information
   */
  private static mapShipping(order: Order): BahnOrderRequestShippingDTO {
    return {
      dueDate: order.shipping.deliveryDate,
      method: order.shipping.method,
      price: order.shipping.price,
      quotedPrice: order.shipping.price,
      address: this.mapAddress(order.shipping.address),
    };
  }

  private static mapOrderItem(
    orderItem: OrderItem,
  ): BahnOrderRequestProductDTO {
    return {
      discount: orderItem.discount,
      price: orderItem.price,
      quantity: orderItem.quantity,
      sku: orderItem.sku,
      name: orderItem.name,
      usageType: orderItem.gift ? BahnUsageType.GIFT : BahnUsageType.NORMAL,
    };
  }

  /**
   * Maps order additional fields
   */
  private static mapOrderAdditionalFields(
    order: Order,
  ): Record<string, string> {
    return {
      U_Project_tag: order.project,
      U_Id_Cotacao: order.shipping.quoteId ?? '',
      U_External_Id: order.externalId,
      U_Gateway: order.payment.gateway,
      SalesPersonCode: BahnSalesPersonCode.PRIME,
    };
  }

  /**
   * Maps customer additional fields
   */
  private static mapCustomerAdditionalFields(): Record<string, string> {
    return {
      GroupCode: BahnOrderGoupCode.PRIME,
    };
  }
}
