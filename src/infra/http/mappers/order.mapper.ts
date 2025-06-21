import type { Address } from '../../../domain/entities/Address';
import type { Customer } from '../../../domain/entities/Customer';
import type { Order } from '../../../domain/entities/Order';
import type { OrderItem } from '../../../domain/entities/OrderItem';
import type { Payment } from '../../../domain/entities/Payment';
import type { Shipping } from '../../../domain/entities/Shipping';
import type {
  CreateOrderAddressDto,
  CreateOrderCustomerDto,
  CreateOrderItemDto,
  CreateOrderPaymentDto,
  CreateOrderRequestDto,
  CreateOrderShippingDto,
} from '../dtos/create-order-request.dto';

/**
 * Mapper for converting REST DTOs to domain entities
 */
export class OrderMapper {
  /**
   * Converts CreateOrderRequestDto to Order entity
   * @param dto - REST API order request DTO
   * @returns Domain order entity
   */
  static toDomain(dto: CreateOrderRequestDto): Order {
    const order: Order = {
      externalId: dto.externalId,
      orderNumber: dto.orderNumber,
      channel: dto.channel,
      items: dto.items.map((item) => this.mapOrderItem(item)),
      shipping: this.mapShipping(dto.shipping),
      customer: this.mapCustomer(dto.customer),
      payment: this.mapPayment(dto.payment),
      project: dto.project,
      additionalFields: dto.additionalFields,
      customerAdditionalFields: dto.customerAdditionalFields,
    };

    return order;
  }

  /**
   * Maps order item DTO to domain entity
   */
  private static mapOrderItem(item: CreateOrderItemDto): OrderItem {
    return {
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
      gift: item.gift,
    };
  }

  /**
   * Maps customer DTO to domain entity
   */
  private static mapCustomer(customer: CreateOrderCustomerDto): Customer {
    return {
      name: customer.name,
      email: customer.email,
      taxIdentification: customer.taxIdentification,
      phoneNumber: customer.phoneNumber,
    };
  }

  /**
   * Maps address DTO to domain entity
   */
  private static mapAddress(address: CreateOrderAddressDto): Address {
    return {
      name: address.name,
      street: address.street,
      streetNumber: address.streetNumber,
      complement: address.complement,
      district: address.district,
      city: address.city,
      uf: address.uf,
      zipCode: address.zipCode,
      phone: address.phone,
      taxIdentification: address.taxIdentification,
    };
  }

  /**
   * Maps payment DTO to domain entity
   */
  private static mapPayment(payment: CreateOrderPaymentDto): Payment {
    return {
      method: payment.method,
      total: payment.total,
      discount: payment.discount,
      installments: payment.installments,
      dueDate: payment.dueDate,
      address: this.mapAddress(payment.address),
      subtotal: payment.subtotal,
      couponCode: payment.couponCode,
      couponDescription: payment.couponDescription,
      nsu: payment.nsu,
      tid: payment.tid,
      paymentGatewayId: payment.paymentGatewayId,
      brand: payment.brand,
      gateway: payment.gateway,
    };
  }

  /**
   * Maps shipping DTO to domain entity
   */
  private static mapShipping(shipping: CreateOrderShippingDto): Shipping {
    return {
      method: shipping.method,
      price: shipping.price,
      quotedPrice: shipping.quotedPrice,
      address: this.mapAddress(shipping.address),
      quoteId: shipping.quoteId,
      deliveryDate: shipping.deliveryDate,
    };
  }
}
