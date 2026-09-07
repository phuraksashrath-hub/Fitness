public static class PaymentFactory
{
    public static Payment Create(PaymentMethod method)
    {
        return method switch
        {
            PaymentMethod.CREDIT_CARD => new CreditCardPayment(),
            PaymentMethod.PROMPTPAY => new PromptPayPayment(),
            _ => throw new ArgumentOutOfRangeException(nameof(method))
        };
    }
}