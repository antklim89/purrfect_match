import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Skeleton } from '@/shared/ui/skeleton';

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-72 h-8" />
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {Array.from({ length: 5 }, (_, i) => (
            <Field key={i}>
              <FieldLabel>
                <Skeleton className="w-48 h-6" />
              </FieldLabel>
              <Skeleton className="w-full h-11" />
            </Field>
          ))}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
