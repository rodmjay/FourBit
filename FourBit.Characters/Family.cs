namespace FourBit.Characters
{
    public class Family
    {
        public Person Father { get; private set; }
        public List<Person> Wives { get; private set; }
        public List<Person> Children { get; private set; }

        public Family(Person father)
        {
            if (father != null && father.Gender != Gender.Male)
            {
                throw new ArgumentException("Father must be male.");
            }

            Father = father;
            Wives = new List<Person>();
            Children = new List<Person>();
        }

        public void AddWife(Person wife)
        {
            if (wife == null || wife.Gender != Gender.Female)
            {
                throw new ArgumentException("Wife must be female."); // Updated message
            }

            Wives.Add(wife);
        }

        public void AddChild(Person child)
        {
            if (child == null)
            {
                throw new ArgumentException("Child cannot be null.");
            }

            Children.Add(child);
        }

        public int TotalMembers => (Father == null ? 0 : 1) + Wives.Count + Children.Count;

        // Scores are the average of all members' respective scores
        public double FaithScore => CalculateAverageScore(member => member.FaithScore);
        public double HopeScore => CalculateAverageScore(member => member.HopeScore);
        public double CharityScore => CalculateAverageScore(member => member.CharityScore);

        private double CalculateAverageScore(Func<Person, int> scoreSelector)
        {
            var allMembers = new[] { Father }
                .Concat(Wives)
                .Concat(Children);

            return allMembers.Any()
                ? allMembers.Average(scoreSelector)
                : 0;
        }
    }
}