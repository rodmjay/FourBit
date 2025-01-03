namespace FourBit.Characters
{
    public class Congregation
    {
        public List<Family> Families { get; private set; }

        public Congregation()
        {
            Families = new List<Family>();
        }

        public void AddFamily(Family family)
        {
            if (family == null)
            {
                throw new ArgumentNullException(nameof(family), "Family cannot be null.");
            }

            Families.Add(family);
        }

        public int NumberOfFamilies => Families.Count;

        public int NumberOfIndividuals => Families.Sum(family => family.TotalMembers);

        public double AverageFamilySize => Families.Any()
            ? Families.Average(family => family.TotalMembers)
            : 0;

        public double AverageNumberOfWives => Families.Any()
            ? Families.Average(family => family.Wives.Count)
            : 0;

        public override string ToString()
        {
            return $"Number of Families: {NumberOfFamilies}\n" +
                   $"Number of Individuals: {NumberOfIndividuals}\n" +
                   $"Average Family Size: {AverageFamilySize:F2}\n" +
                   $"Average Number of Wives: {AverageNumberOfWives:F2}";
        }
    }
}