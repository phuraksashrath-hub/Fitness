namespace FitnessCenter.Api.Strategies;

public interface IDiscountStrategy
{
    decimal GetDiscount(decimal amount);
}