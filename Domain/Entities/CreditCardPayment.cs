namespace FitnessCenter.Api.Domain.Entities;

public class CreditCardPayment : Payment
{
    public override bool ProcessPayment()
    {
        // mock gateway
        Status = "PAID";
        return true;
    }
}