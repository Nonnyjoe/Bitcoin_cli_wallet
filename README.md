# **Bitcoin CLI Wallet Project**

This project is a simple command-line interface (CLI) tool designed to manage Bitcoin wallets securely and conveniently. It allows users to create, encrypt, store, and access multiple Bitcoin wallets directly from the terminal.

### How It Works

1. **Creating a Wallet**: Users can create a new Bitcoin wallet by running a command in the terminal. The program guides them through the process and generates a new wallet with a unique name.

2. **Encryption for Security**: Upon creation, the wallet data is encrypted using industry-standard encryption algorithms. This ensures that sensitive wallet information, such as private keys and addresses, remains secure even if the files are accessed by unauthorized users.

3. **Storage and Management**: The encrypted wallet data is stored in a designated folder within the user's system. Additionally, a separate encrypted file keeps track of all the wallets created by the user, allowing for easy retrieval and management of multiple wallets.

4. **Accessing Wallets**: To access a previously created wallet, users simply need to provide the name of the wallet they wish to access. The program locates the corresponding encrypted file, decrypts the wallet data, and grants the user access to their wallet details.

5. **Multiple Wallet Support**: Users have the flexibility to create and manage multiple Bitcoin wallets from the CLI. This feature enables users to organize their Bitcoin holdings effectively and maintain separate wallets for different purposes or accounts.

### Encryption for Security

The project employs robust encryption techniques to safeguard users' wallet data. By encrypting the wallet files, the project ensures that sensitive information, such as private keys and wallet addresses, remains confidential and protected against unauthorized access.

### Getting Started

To get started with the Bitcoin CLI Wallet project, follow these simple steps:

1. **Installation**: Clone the project repository to your local machine and run ```npm install``` to install all necessary dependencies.

2. **Creating a Wallet**: Run the comand ```tsc index.ts``` to create a javascript instance of the code. run the command ```node  index.js``` to execute a prewritten script that'll generate, encrypt and store 3 wallets, ckeck the terminal for necesarry logs.

3. **Managing Multiple Wallets**: Take advantage of the project's support for multiple wallets to organize and manage your Bitcoin holdings efficiently.

### Conclusion

The Bitcoin CLI Wallet project offers a convenient and secure solution for managing Bitcoin wallets directly from the terminal. With its encryption features and support for multiple wallets, users can confidently store, access, and manage their Bitcoin holdings with ease.

For detailed instructions and usage guidelines, refer to the project documentation and README file. Happy wallet management!
