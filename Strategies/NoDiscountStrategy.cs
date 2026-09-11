namespace FitnessCenter.Api.Strategies;

public class NoDiscountStrategy : IDiscountStrategy
{
    public decimal GetDiscount(decimal amount) => 0m;
}