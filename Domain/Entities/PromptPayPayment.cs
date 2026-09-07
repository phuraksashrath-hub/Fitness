public class PromptPayPayment : Payment
{
    public override bool ProcessPayment()
    {
        // mock qr payment
        Status = "PAID";
        return true;
    }
}