import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  // @Column('date')
  // date_of_event: Date;

  // @Column('text')
  // type: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('text', { nullable: true })
  adressDesciption: string;

  @Column('text', { default: 'ATP' })
  publicType?: string;

  // @Column('text', { array: true })
  // tags: string[];

  // @Column()
  // images: string[]

  @BeforeInsert()
  checkSlugInsert() {
   

    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
   
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');

      return this.slug;
    
  }
}
