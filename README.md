---
## Installation

### Prerequisites

+ Python 3.11.1

+ MySQL database ver 8.0.32

### Setup
1. Clone the repository

    git clone https://github.com/navaldabral/articles.git

    cd articles
2. Create a virtual environment and activate it
   
   virtualenv venv

   source venv/bin/activate

3. Install the dependencies

    pip install -r requirements.txt

4. Configure the database

    Create a MySQL database. Set name `user_table`

    upload the given `user.sql` in `user_table` database

    or

    Models are created automatically when FastAPI run

        "Upload blog.sql if dummy data is needed."
<img width="1469" alt="Screenshot 2024-09-30 at 2 37 42 AM" src="https://github.com/user-attachments/assets/89ced9cf-946b-4aac-bc47-9827bf6f6f8d">
