using NUnit.Framework;
using FourBit.Characters;

namespace FourBit.Characters.Tests
{
    [TestFixture]
    public class FamilyTests
    {
        [Test]
        public void TestFamilyWithFatherOnly()
        {
            // Arrange
            var father = new Person("John Doe", DateTime.Now.AddYears(-40), Gender.Male, 90, 85, 88);
            var family = new Family(father);

            // Act
            var totalMembers = family.TotalMembers;

            // Assert
            Assert.That(totalMembers, Is.EqualTo(1), "Incorrect total members for a family with only a father.");
        }

        [Test]
        public void TestFamilyWithFatherAndOneWife()
        {
            // Arrange
            var father = new Person("John Doe", DateTime.Now.AddYears(-40), Gender.Male, 90, 85, 88);
            var wife = new Person("Jane Doe", DateTime.Now.AddYears(-38), Gender.Female, 85, 88, 90);
            var family = new Family(father);
            family.AddWife(wife);

            // Act
            var totalMembers = family.TotalMembers;

            // Assert
            Assert.That(totalMembers, Is.EqualTo(2), "Incorrect total members for a family with one wife.");
        }

        [Test]
        public void TestFamilyWithFatherOneWifeAndTwoChildren()
        {
            // Arrange
            var father = new Person("John Doe", DateTime.Now.AddYears(-40), Gender.Male, 90, 85, 88);
            var wife = new Person("Jane Doe", DateTime.Now.AddYears(-38), Gender.Female, 85, 88, 90);
            var child1 = new Person("Alice Doe", DateTime.Now.AddYears(-12), Gender.Female, 75, 80, 82);
            var child2 = new Person("Bob Doe", DateTime.Now.AddYears(-10), Gender.Male, 78, 76, 79);

            var family = new Family(father);
            family.AddWife(wife);
            family.AddChild(child1);
            family.AddChild(child2);

            // Act
            var totalMembers = family.TotalMembers;

            // Assert
            Assert.That(totalMembers, Is.EqualTo(4), "Incorrect total members for a family with one wife and two children.");
        }

        [Test]
        public void TestFamilyWithFatherAndMultipleWives()
        {
            // Arrange
            var father = new Person("John Doe", DateTime.Now.AddYears(-40), Gender.Male, 90, 85, 88);
            var wife1 = new Person("Jane Doe", DateTime.Now.AddYears(-38), Gender.Female, 85, 88, 90);
            var wife2 = new Person("Mary Doe", DateTime.Now.AddYears(-35), Gender.Female, 82, 80, 85);

            var family = new Family(father);
            family.AddWife(wife1);
            family.AddWife(wife2);

            // Act
            var totalMembers = family.TotalMembers;

            // Assert
            Assert.That(totalMembers, Is.EqualTo(3), "Incorrect total members for a family with two wives.");
        }

        [Test]
        public void TestFamilyWithNoFather_ShouldReturnCorrectCount()
        {
            // Arrange
            var family = new Family(null); // Allowing null father for this test case
            var wife = new Person("Jane Doe", DateTime.Now.AddYears(-38), Gender.Female, 85, 88, 90);
            var child = new Person("Alice Doe", DateTime.Now.AddYears(12), Gender.Female, 75, 80, 82);

            family.AddWife(wife);
            family.AddChild(child);

            // Act
            var totalMembers = family.TotalMembers;

            // Assert
            Assert.That(totalMembers, Is.EqualTo(2), "Incorrect total members for a family with no father.");
        }
    }
}
