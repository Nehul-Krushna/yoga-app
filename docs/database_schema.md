# Database Schema

The following Entity-Relationship (ER) diagram represents the database schema for the Yoga Class Admission System.

![ER Diagram](./docs/ERDiagram.PNG)

## Participants Table

- **participant_id (PK):** Unique identifier for each participant.
- **name:** Name of the participant.
- **age:** Age of the participant.
- **mobile:** Mobile number of the participant.
- **batch_id (FK):** Foreign key referencing the Batches table.
- **month:** Registration month of the participant.

## Batches Table

- **batch_id (PK):** Unique identifier for each batch.
- **start_time:** Start time of the batch.
- **end_time:** End time of the batch.

## Payments Table

- **payment_id (PK):** Unique identifier for each payment.
- **participant_id (FK):** Foreign key referencing the Participants table.
- **payment_date:** Date of the payment.
- **amount:** Amount of the payment (Default Rs 500).

### Relationships

- **Participants to Batches:** Many-to-Many (participants can enroll in multiple batches, and batches can have multiple participants).
- **Participants to Payments:** One-to-Many (a participant can make multiple payments).
