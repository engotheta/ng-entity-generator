// import csv
// import random

// # Read names from CSV file
// with open('Untitled-1', encoding='utf-8') as f:
//   reader = csv.reader(f)
//   names = [row[0].strip() for row in reader if row]

// # Remove duplicates and shuffle
// unique_names = list(set(names))
// random.shuffle(unique_names)

// # Split into lists of at most 7 items
// result = [unique_names[i:i+7] for i in range(0, len(unique_names), 7)]

// # Print each list
// for idx, group in enumerate(result, 1):
//   print(f"List {idx}: {group}")
