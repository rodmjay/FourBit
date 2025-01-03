namespace FourBit.Characters
{
    public class Person
    {
        public string Name { get; set; }
        public DateTime Birthday { get; set; }
        public Gender Gender { get; set; }
        public int FaithScore { get; set; }
        public int HopeScore { get; set; }
        public int CharityScore { get; set; }

        // Age is dynamically calculated based on the Birthday
        public int Age
        {
            get
            {
                var today = DateTime.Today;
                var age = today.Year - Birthday.Year;

                if (Birthday > today.AddYears(-age)) // Check if birthday hasn't occurred yet this year
                {
                    age--;
                }

                return age;
            }
        }

        public Person(string name, DateTime birthday, Gender gender, int faithScore, int hopeScore, int charityScore)
        {
            Name = name;
            Birthday = birthday;
            Gender = gender;
            FaithScore = faithScore;
            HopeScore = hopeScore;
            CharityScore = charityScore;
        }

        public override string ToString()
        {
            return $"{Name}, Age: {Age}, Gender: {Gender}, Faith: {FaithScore}, Hope: {HopeScore}, Charity: {CharityScore}";
        }
    }
}