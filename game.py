import random

number = random.randint(1, 10)
guess = int(input("Guess a number between 1 and 10: "))

while guess != number:
    print("Wrong! Try again.")
    guess = int(input("Guess a number between 1 and 10: "))

print("Correct! The number was", number)