import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { AnswerAddDto } from './dto/answer-add.dto';

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(dto: AnswerAddDto, userId: number) {
    const exam = await this.prismaService.exam.findUnique({
      where: {
        id: dto.examId
      }
    });
  
    let quesitons = [];
    try{
      quesitons = JSON.parse(exam.content);
    } catch(e) {}
  
    let answers = [];
    try{
      answers = JSON.parse(dto.content);
    } catch(e) {}
    
    let totalScore = 0;
    answers.forEach(answer => {
      const question = quesitons.find(item => item.id === answer.id);
  
      if(question.type === 'input') {
        if(answer.answer.includes(question.answer)) {
          totalScore += question.score
        }
      } else {
        if(answer.answer === question.answer) {
          totalScore += question.score
        }
      }
    })
  
    return this.prismaService.answer.create({
      data: {
        content: dto.content,
        score: totalScore,
        answerer: {
          connect: {
              id: userId
          }
        },
        exam: {
          connect: {
              id: dto.examId
          }
        }
      },
    })
  }

  async list(examId: number) {
      return this.prismaService.answer.findMany({
        where: {
          examId
        },
        include: {
          exam: true,
          answerer: true
        }
      })
  }

  async find(id: number) {
      return this.prismaService.answer.findUnique({
        where: {
          id
        },
        include: {
          exam: true,
          answerer: true
        }
      })
  }

}
