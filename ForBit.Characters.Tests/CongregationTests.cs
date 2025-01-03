using NUnit.Framework;

namespace FourBit.Characters.Tests
{
    [TestFixture]
    public class CongregationTests
    {
        [Test]
        public void TestAddFamilyAndMetricsCalculation()
        {
            // Arrange
            var congregation = new Congregation();

            // Calculate birthdays for ages
            var today = DateTime.Today;
            var father1Birthday = today.AddYears(-40); // 40 years ago
            var wife1Birthday = today.AddYears(-38);  // 38 years ago
            var child1Birthday = today.AddYears(-12); // 12 years ago
            var child2Birthday = today.AddYears(-10); // 10 years ago
            var father2Birthday = today.AddYears(-45); // 45 years ago
            var wife2Birthday = today.AddYears(-42);  // 42 years ago

            var father1 = new Person("John Doe", father1Birthday, Gender.Male, 90, 85, 88);
            var wife1 = new Person("Jane Doe", wife1Birthday, Gender.Female, 85, 88, 90);
            var child1 = new Person("Alice Doe", child1Birthday, Gender.Female, 75, 80, 82);
            var child2 = new Person("Bob Doe", child2Birthday, Gender.Male, 78, 76, 79);

            var family1 = new Family(father1);
            family1.AddWife(wife1);
            family1.AddChild(child1);
            family1.AddChild(child2);

            var father2 = new Person("Mike Smith", father2Birthday, Gender.Male, 88, 84, 86);
            var wife2 = new Person("Mary Smith", wife2Birthday, Gender.Female, 80, 85, 88);

            var family2 = new Family(father2);
            family2.AddWife(wife2);

            congregation.AddFamily(family1);
            congregation.AddFamily(family2);

            // Assert
            Assert.That(congregation.NumberOfFamilies, Is.EqualTo(2));
            Assert.That(congregation.NumberOfIndividuals, Is.EqualTo(6));
            Assert.That(congregation.AverageFamilySize, Is.EqualTo(3.5).Within(0.5));
            Assert.That(congregation.AverageNumberOfWives, Is.EqualTo(1.0).Within(0.5));
        }

        [Test]
        public void TestEmptyCongregationMetrics()
        {
            var congregation = new Congregation();

            Assert.That(congregation.NumberOfFamilies, Is.EqualTo(0));
            Assert.That(congregation.NumberOfIndividuals, Is.EqualTo(0));
            Assert.That(congregation.AverageFamilySize, Is.EqualTo(0));
            Assert.That(congregation.AverageNumberOfWives, Is.EqualTo(0));
        }

        [Test]
        public void TestAddNullFamilyThrowsException()
        {
            var congregation = new Congregation();

            Assert.That(() => congregation.AddFamily(null), Throws.ArgumentNullException);
        }

        [Test]
        public void TestSingleFamilyWithNoWives()
        {
            var father = new Person("John Doe", DateTime.Now.AddYears(-50), Gender.Male, 92, 88, 90);
            var family = new Family(father);

            var congregation = new Congregation();
            congregation.AddFamily(family);

            Assert.That(congregation.NumberOfFamilies, Is.EqualTo(1));
            Assert.That(congregation.NumberOfIndividuals, Is.EqualTo(1));
            Assert.That(congregation.AverageFamilySize, Is.EqualTo(1));
            Assert.That(congregation.AverageNumberOfWives, Is.EqualTo(0));
        }
    }
}
