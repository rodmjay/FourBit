#region Header Info

// Copyright 2024 TechValleyTalent.  All rights reserved

#endregion

using NUnit.Framework;

namespace FourBit.Characters.Tests;

[TestFixture]
public class PersonTests
{
    [Test]
    public void TestAgeCalculation_BeforeBirthday()
    {
        // Arrange
        var today = DateTime.Today;
        var birthday = today.AddYears(-30).AddDays(1); // 30 years ago, but birthday is tomorrow
        var person = new Person("John Doe", birthday, Gender.Male, 90, 85, 88);

        // Act
        var age = person.Age;

        // Assert
        Assert.That(age, Is.EqualTo(29), "Age calculation is incorrect for before the birthday.");
    }

    [Test]
    public void TestAgeCalculation_AfterBirthday()
    {
        // Arrange
        var today = DateTime.Today;
        var birthday = today.AddYears(-30).AddDays(-1); // 30 years ago, birthday was yesterday
        var person = new Person("John Doe", birthday, Gender.Male, 90, 85, 88);

        // Act
        var age = person.Age;

        // Assert
        Assert.That(age, Is.EqualTo(30), "Age calculation is incorrect for after the birthday.");
    }

    [Test]
    public void TestAgeCalculation_OnBirthday()
    {
        // Arrange
        var today = DateTime.Today;
        var birthday = today.AddYears(-30); // 30 years ago, birthday is today
        var person = new Person("John Doe", birthday, Gender.Male, 90, 85, 88);

        // Act
        var age = person.Age;

        // Assert
        Assert.That(age, Is.EqualTo(30), "Age calculation is incorrect for on the birthday.");
    }
}