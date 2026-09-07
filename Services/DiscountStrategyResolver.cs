public static class DiscountStrategyResolver
{
    public static IDiscountStrategy Resolve(string discountType)
    {
        return discountType.ToLower() switch
        {
            "student" => new StudentDiscountStrategy(),
            "renewal" => new RenewalDiscountStrategy(),
            _ => new NoDiscountStrategy()
        };
    }
}